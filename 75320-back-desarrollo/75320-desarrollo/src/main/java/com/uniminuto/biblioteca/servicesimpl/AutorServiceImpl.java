package com.uniminuto.biblioteca.servicesimpl;

import com.uniminuto.biblioteca.entity.Autor;                               //Autor Daniel Perez ID: 885394
import com.uniminuto.biblioteca.repository.AutorRepository;
import com.uniminuto.biblioteca.services.AutorService;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service                                                                    //Autor Daniel Perez ID: 885394
public class AutorServiceImpl implements AutorService {

    @Autowired
    private AutorRepository autorRepository;

    @Override
    public List<Autor> obtenerListadoAutores() {
        return this.autorRepository.findAllByOrderByFechaNacimientoDesc();
    }

    @Override                                                                                   //Autor Daniel Perez ID: 885394
    public List<Autor> obtenerListadoAutoresPorNacionalidad(String nacionalidad)                                    
            throws BadRequestException {
        List<Autor> listaAutores = this.autorRepository.findByNacionalidad(nacionalidad);
        if (listaAutores.isEmpty()) {
            throw new BadRequestException("No existen autores con esa nacionalidad.");
        }
        return listaAutores;
    }

    @Override                                                                                   //Autor Daniel Perez ID: 885394
    public Autor obtenerAutorPorId(Integer autorId) throws BadRequestException {
        Optional<Autor> optAutor = this.autorRepository.findById(autorId);
        if (!optAutor.isPresent()) {
            throw new BadRequestException("No se encuentra el autor con el id " + autorId);
        }
        return optAutor.get();
    }

    @Override                                                                                       //Autor Daniel Perez ID: 885394
    public List<Autor> obtenerAutoresPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin)
            throws BadRequestException {
        List<Autor> autores = autorRepository.findByFechaNacimientoBetween(fechaInicio, fechaFin);
        if (autores.isEmpty()) {
            throw new BadRequestException("No se encontraron autores en el rango de fechas.");
        }
        return autores;
    }

    @Override                                                                                      //Autor Daniel Perez ID: 885394
    public List<Autor> obtenerAutoresOrdenadosPorFechaNacimientoAsc() {
        return this.autorRepository.findAllByOrderByFechaNacimientoAsc();
    }

    @Override                                                                                       //Autor Daniel Perez ID: 885394
    public List<Autor> obtenerAutoresOrdenadosPorFechaNacimientoDesc() {
        return this.autorRepository.findAllByOrderByFechaNacimientoDesc();
    }

    @Override                                                                                       //Autor Daniel Perez ID: 885394
    public List<Autor> obtenerAutoresOrdenadosPorFechaAsc() {
        return autorRepository.findAllByOrderByFechaNacimientoAsc();
    }

    
    public Autor guardar(Autor autor) {                                                             //Autor Daniel Perez ID: 885394
        return autorRepository.save(autor);
    }

    
    public Autor actualizar(Integer id, Autor autor) {                                             //Autor Daniel Perez ID: 885394
        Optional<Autor> optAutor = autorRepository.findById(id);
        if (!optAutor.isPresent()) {
            throw new RuntimeException("No se encontró el autor con ID: " + id);
        }

        Autor autorExistente = optAutor.get();                                                      //Autor Daniel Perez ID: 885394
        autorExistente.setNombre(autor.getNombre());
        autorExistente.setNacionalidad(autor.getNacionalidad());
        autorExistente.setFechaNacimiento(autor.getFechaNacimiento());

        return autorRepository.save(autorExistente);
    }

    @Override
    public Autor guardarAutor(Autor autor) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public Autor actualizarAutor(Integer id, Autor autor) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }
}