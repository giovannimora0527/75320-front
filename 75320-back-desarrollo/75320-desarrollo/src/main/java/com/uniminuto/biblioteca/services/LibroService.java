package com.uniminuto.biblioteca.services;

import com.uniminuto.biblioteca.entity.Libro;
import java.time.LocalDateTime;
import java.util.List;
import org.apache.coyote.BadRequestException;

/**
 *
 * @author lmora
 */
public interface LibroService {
    /**
     * Lista todos los libros.
     * @return Lista de libros registrados.
     * @throws BadRequestException excepcion.
     */
    List<Libro> listarLibros() throws BadRequestException;
    
    /**
     * Obtiene un libro dado su id.
     * @param libroId Id del libro.
     * @return Libro.
     * @throws BadRequestException excepcion.
     */
    Libro obtenerLibroId(Integer libroId) throws BadRequestException;
    
    /**
     * Obtiene los libros registrados dado un autor.
     * @param autorId Id del autor.
     * @return lista de libros.
     * @throws BadRequestException excepcion.
     */
    List<Libro> obtenerLibrosPorAutor(Integer autorId) throws BadRequestException;
    
    
    /**
     * Obtiene un libro dado su nombre.
     * @param nombreLibro Nombre del libro.
     * @return Libro.
     * @throws BadRequestException excepcion.
     */
    Libro obtenerLibroPorNombre(String nombreLibro) throws BadRequestException;
    
    /**
     * Obtiene el listado de libros dado la fecha de publicacion.
     * @param anioIni Año inicial de la consulta.
     * @param anioFin Año final de la consulta.
     * @return Lista de libros que cumplen con el criterio.
     * @throws BadRequestException excepcion.
     */
    List<Libro> obtenerLibroXRangoPublicacion(Integer anioIni, 
            Integer anioFin) throws BadRequestException;
}
