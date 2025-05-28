import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BackendService } from "./backend.service";
import { Categoria } from "../models/categoria";

@Injectable({
  providedIn: 'root'
})

export class CategoriaService {
  api = "categoria";

  constructor(private readonly backendService: BackendService) {
    
  }

  getCategorias(): Observable<Categoria[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }
}