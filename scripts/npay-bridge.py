#!/usr/bin/env python3
"""
APTListings와 동일: curl_cffi Chrome impersonation으로 fin.land.naver.com 호출.
stdin: 한 줄 JSON {"id","method","path","params?","body?","referer?"}
stdout: 한 줄 JSON {"id","ok", "status?", "data?"|"error?"}  (ensure_ascii=True)
"""
from __future__ import annotations

import json
import sys
import time
from typing import Any


def _emit(obj: dict[str, Any]) -> None:
    # Windows 파이프 한글 깨짐 방지: ASCII escape(\\uXXXX)만 사용
    sys.stdout.write(json.dumps(obj, ensure_ascii=True) + "\n")
    sys.stdout.flush()


try:
    from curl_cffi.requests import RequestsError, Session
except ImportError:
    _emit(
        {
            "id": None,
            "ok": False,
            "error": "curl_cffi 미설치. pip install curl_cffi",
        }
    )
    sys.exit(2)

BASE_URL = "https://fin.land.naver.com/front-api/v1"
BOOTSTRAP_URLS = (
    "https://www.naver.com",
    "https://fin.land.naver.com/map",
)


class Bridge:
    def __init__(self, request_interval: float = 1.0) -> None:
        self.request_interval = request_interval
        self._last_at = 0.0
        self._bootstrapped = False
        self.session = Session(impersonate="chrome120")
        self.session.headers.update(
            {
                "Accept": "application/json, text/plain, */*",
                "Referer": "https://fin.land.naver.com/map",
                "Origin": "https://fin.land.naver.com",
            }
        )

    def bootstrap(self) -> None:
        if self._bootstrapped:
            return
        for url in BOOTSTRAP_URLS:
            self.session.get(url, timeout=30)
            time.sleep(0.15)
        self._bootstrapped = True

    def _throttle(self) -> None:
        elapsed = time.monotonic() - self._last_at
        if elapsed < self.request_interval:
            time.sleep(self.request_interval - elapsed)

    def request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        body: Any = None,
        referer: str | None = None,
        max_retries: int = 8,
    ) -> dict[str, Any]:
        self.bootstrap()
        url = f"{BASE_URL}{path}"
        last_failure = "API 요청 실패"

        for attempt in range(max_retries):
            self._throttle()
            try:
                headers = {"Content-Type": "application/json"}
                if referer:
                    headers["Referer"] = referer
                response = self.session.request(
                    method,
                    url,
                    params=params,
                    json=body,
                    timeout=30,
                    headers=headers,
                )
                self._last_at = time.monotonic()

                if response.status_code == 429:
                    last_failure = "요청이 너무 많습니다 (Rate Limit)."
                    time.sleep(min(2 ** (attempt + 1), 32))
                    continue

                data = response.json()

                if response.status_code >= 400:
                    detail = (
                        data.get("detailCode")
                        or data.get("message")
                        or f"HTTP {response.status_code}"
                    )
                    raise RuntimeError(str(detail))

                if data.get("detailCode") == "TOO_MANY_REQUESTS":
                    last_failure = "요청이 너무 많습니다 (Rate Limit)."
                    if attempt < max_retries - 1:
                        time.sleep(min(2 ** (attempt + 1), 32))
                        continue
                    raise RuntimeError(last_failure)

                if not data.get("isSuccess", True):
                    detail = data.get("detailCode") or data.get("message") or "API 오류"
                    raise RuntimeError(str(detail))

                return {"ok": True, "status": response.status_code, "data": data}
            except RuntimeError as exc:
                return {"ok": False, "error": str(exc)}
            except RequestsError as exc:
                last_failure = f"네트워크 오류: {exc}"
                if attempt < max_retries - 1:
                    time.sleep(min(2**attempt, 16))
                    continue
                return {"ok": False, "error": last_failure}
            except Exception as exc:  # noqa: BLE001
                return {"ok": False, "error": str(exc)}

        return {"ok": False, "error": last_failure}


def main() -> None:
    interval = 1.0
    if len(sys.argv) > 1:
        try:
            interval = float(sys.argv[1])
        except ValueError:
            pass
    bridge = Bridge(request_interval=interval)
    _emit({"ok": True, "ready": True})

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError as exc:
            _emit({"id": None, "ok": False, "error": f"bad json: {exc}"})
            continue

        req_id = msg.get("id")
        if msg.get("cmd") == "ping":
            _emit({"id": req_id, "ok": True, "pong": True})
            continue
        if msg.get("cmd") == "quit":
            _emit({"id": req_id, "ok": True, "bye": True})
            break

        method = str(msg.get("method") or "GET").upper()
        path = str(msg.get("path") or "")
        result = bridge.request(
            method,
            path,
            params=msg.get("params"),
            body=msg.get("body"),
            referer=msg.get("referer"),
        )
        result["id"] = req_id
        _emit(result)


if __name__ == "__main__":
    main()
