package com.uniminuto.biblioteca.repository;

import com.uniminuto.biblioteca.entity.Autor;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author lmora
 */
@Repository
public interface AutorRepository extends
        JpaRepository<Autor, Integer>  {
    List<Autor> findByFechaNacimientoBetween(LocalDate fechaNacimientoInicial,
            LocalDate fechaNacimientoFin);
    
    List<Autor> findByNacionalidad(String nacionalidad);
    
    List<Autor> findAllByOrderByFechaNacimientoAsc();
    
    List<Autor> findAllByOrderByFechaNacimientoDesc();
}
