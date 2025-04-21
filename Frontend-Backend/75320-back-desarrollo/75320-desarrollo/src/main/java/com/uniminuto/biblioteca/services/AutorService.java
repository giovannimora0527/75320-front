package com.uniminuto.biblioteca.services;

import com.uniminuto.biblioteca.entity.Autor;
import java.time.LocalDate;
import java.util.List;
import org.apache.coyote.BadRequestException;                             //Autor Daniel Perez ID:885394

public interface AutorService {
    List<Autor> obtenerListadoAutores();
    
    List<Autor> obtenerListadoAutoresPorNacionalidad(String nacionalidad) throws BadRequestException;
    
    Autor obtenerAutorPorId(Integer autorId) throws BadRequestException;
    
    List<Autor> obtenerAutoresPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin) throws BadRequestException;       //Autor Daniel Perez ID:885394

    List<Autor> obtenerAutoresOrdenadosPorFechaNacimientoAsc();       //Autor Daniel Perez ID:885394

    List<Autor> obtenerAutoresOrdenadosPorFechaNacimientoDesc();      //Autor Daniel Perez ID:885394

    List<Autor> obtenerAutoresOrdenadosPorFechaAsc();         //Autor Daniel Perez ID:885394

    Autor guardarAutor(Autor autor);                          //Autor Daniel Perez ID:885394

    Autor actualizarAutor(Integer id, Autor autor);           //Autor Daniel Perez ID:885394

    public Autor guardar(Autor autor);                        //Autor Daniel Perez ID:885394

    public Autor actualizar(Integer id, Autor autor);         //Autor Daniel Perez ID:885394
}
