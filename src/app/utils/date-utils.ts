import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateTimeUtils {
  // Formatear manualmente en zona horaria local
  formatDateCurrentZone(fecha: Date) {
    const yyyy = fecha.getFullYear();
    const MM = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    const hh = String(fecha.getHours()).padStart(2, '0');
    const mm = String(fecha.getMinutes()).padStart(2, '0');
    const ss = String(fecha.getSeconds()).padStart(2, '0');

    const fechaFormato = `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
    return fechaFormato;
  }
}
