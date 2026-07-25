-- 분석보고서 PDF/마크다운 업로드 허용 (property-images 버킷)
update storage.buckets
set
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/jpg',
    'application/pdf',
    'text/markdown',
    'text/plain',
    'application/octet-stream'
  ],
  file_size_limit = 52428800 -- 50MB
where id = 'property-images';
