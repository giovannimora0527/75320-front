package com.uniminuto.biblioteca.apicontroller;

import com.uniminuto.biblioteca.entity.Autor;                                   
import com.uniminuto.biblioteca.services.AutorService;
import java.time.LocalDate;                                                 
import java.util.List;
import org.apache.coyote.BadRequestException;                                           
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/autores")
public class AutorApiController {

    @Autowired                 
    private AutorService autorService;

    @PostMapping                                                            //Autor Daniel Perez ID: 885394
    public ResponseEntity<Autor> crearAutor(@RequestBody Autor autor) {
        Autor nuevo = autorService.guardar(autor); 
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")                                                    //Autor Daniel Perez ID: 885394
    public ResponseEntity<Autor> actualizarAutor(@PathVariable Integer id, @RequestBody Autor autor) {
        Autor actualizado = autorService.actualizar(id, autor); 
        return ResponseEntity.ok(actualizado);
    }

    @GetMapping                                                             //Autor Daniel Perez ID: 885394
    public ResponseEntity<List<Autor>> listarAutores() {
        return ResponseEntity.ok(this.autorService.obtenerListadoAutores());
    }

    @GetMapping("/nacionalidad")                                            //Autor Daniel Perez ID: 885394
    public ResponseEntity<List<Autor>> listarAutoresByNacionalidad(@RequestParam String nacionalidad) throws BadRequestException {
        return ResponseEntity.ok(this.autorService.obtenerListadoAutoresPorNacionalidad(nacionalidad));
    }

    @GetMapping("/{id}")                                                    //Autor Daniel Perez ID: 885394
    public ResponseEntity<Autor> listarAutorPorId(@PathVariable("id") Integer autorId) throws BadRequestException {
        return ResponseEntity.ok(this.autorService.obtenerAutorPorId(autorId));
    }

    @GetMapping("/rango-fechas")                                            //Autor Daniel Perez ID: 885394
    public ResponseEntity<List<Autor>> listarAutoresPorRangoFechas(
        @RequestParam LocalDate fechaInicio,
        @RequestParam LocalDate fechaFin
    ) throws BadRequestException {
        return ResponseEntity.ok(this.autorService.obtenerAutoresPorRangoFechas(fechaInicio, fechaFin));
    }

    @GetMapping("/ordenados")                                                                                   //Autor Daniel Perez ID: 885394
    public ResponseEntity<List<Autor>> listarAutoresOrdenadosPorFechaNacimiento(@RequestParam String orden) {
        List<Autor> autores;
        if ("asc".equalsIgnoreCase(orden)) {
            autores = autorService.obtenerAutoresOrdenadosPorFechaAsc();
        } else {
            autores = autorService.obtenerListadoAutores();
        }
        return ResponseEntity.ok(autores);
    }
}