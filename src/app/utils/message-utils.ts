import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon } from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class MessageUtils {
    public showMessage(title: string, text: string, icon: SweetAlertIcon) {
        Swal.fire({
          title: title,
          text: text,
          icon: icon,
          confirmButtonText: 'Aceptar',
          customClass: {
            container: 'position-fixed',
            popup: 'swal-overlay'
          },
          didOpen: () => {
            const swalPopup = document.querySelector('.swal2-popup');
            if (swalPopup) {
              (swalPopup as HTMLElement).style.zIndex = '1060';
            }
          }
        });
      }
}