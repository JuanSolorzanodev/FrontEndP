import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private apiUrl = 'http://localhost:8000/api/categories'; // URL base de tu API

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las categorías
   * @returns Observable con la lista de categorías
   */
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear una nueva categoría
   * @param categoria Datos de la nueva categoría
   * @returns Observable con la categoría creada
   */
  createCategoria(categoria: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, categoria).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar una categoría existente
   * @param id ID de la categoría a actualizar
   * @param categoria Datos actualizados de la categoría
   * @returns Observable con la categoría actualizada
   */
  updateCategoria(id: number, categoria: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, categoria).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar una categoría
   * @param id ID de la categoría a eliminar
   * @returns Observable vacío al completar la eliminación
   */
  deleteCategoria(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  

  /**
   * Manejo de errores en las peticiones HTTP
   * @param error Error recibido
   * @returns Observable con el error
   */
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error); // Log del error
    return throwError(() => new Error(error.message || 'Error en la API'));
  }
}
