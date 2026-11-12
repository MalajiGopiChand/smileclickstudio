import { api, apiBase } from './data';

export async function uploadMedia(file: File, options: { mode?: string; kind?: string; purpose?: 'new'|'poster'|'replace'; itemId?: string; progress?: (percent: number) => void } = {}) {
  const kind = options.kind || 'photo', purpose = options.purpose || 'new';
  if (!(kind === 'film' ? file.type === 'video/mp4' : ['image/jpeg','image/png','image/webp'].includes(file.type))) throw new Error('Choose a supported file matching the media type.');
  if (file.size <= 0 || file.size > (kind === 'film' ? 200 : 10)*1024*1024) throw new Error('The file exceeds the allowed size.');
  let target = purpose === 'new' ? `${apiBase}/admin/upload?kind=${kind}` : `${apiBase}/admin/media/${options.itemId}/${purpose}`;
  let reservation: { id: string; signedUrl: string } | undefined;
  if (options.mode === 'signed') {
    const signed = await api('/admin/uploads/sign', { method:'POST', body:JSON.stringify({ type:file.type, size:file.size, kind, purpose, itemId:options.itemId }) }) as { id: string; signedUrl: string };
    reservation = signed;
    target = signed.signedUrl;
  }
  await new Promise<void>((resolve,reject) => {
    const xhr = new XMLHttpRequest(); xhr.open(reservation ? 'PUT':'POST',target); xhr.withCredentials = !reservation; xhr.timeout = 15*60*1000;
    xhr.setRequestHeader('Content-Type',file.type);
    if (reservation) { xhr.setRequestHeader('x-upsert','false'); xhr.setRequestHeader('cache-control','max-age=3600'); }
    xhr.upload.onprogress = e => { if(e.lengthComputable)options.progress?.(Math.round(e.loaded/e.total*100)); };
    xhr.onload = () => { if(xhr.status>=200&&xhr.status<300)resolve();else { let message = 'Upload failed. Please sign in again if your session expired.'; try { const result=JSON.parse(xhr.responseText);message=result.error||result.message||message; } catch {} reject(new Error(message)); } };
    xhr.onerror = () => reject(new Error('Upload interrupted. Check your connection and the library before retrying.'));
    xhr.ontimeout = () => reject(new Error('Upload timed out. Try a smaller file or a faster connection.'));
    xhr.send(file);
  });
  if (reservation) return api('/admin/uploads/complete',{method:'POST',body:JSON.stringify({id:reservation.id})});
}
