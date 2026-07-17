/** 관리코드 충돌 시 덮어쓰기 / 신규 등록 선택 */
export function askManageCodeConflict(manageCode: string): "overwrite" | "create_new" | null {
  const overwrite = window.confirm(
    `관리코드 ${manageCode} 가 이미 등록되어 있습니다.\n\n[확인] 기존 물건을 덮어쓰기\n[취소] 다른 선택`,
  );
  if (overwrite) return "overwrite";

  const createNew = window.confirm(
    `새 관리코드로 새 물건을 등록할까요?\n\n[확인] 신규 등록\n[취소] 저장 취소`,
  );
  if (createNew) return "create_new";
  return null;
}

export type ManageCodeConflictResponse = {
  error?: string;
  code?: string;
  manageCode?: string;
  existingId?: string;
};
