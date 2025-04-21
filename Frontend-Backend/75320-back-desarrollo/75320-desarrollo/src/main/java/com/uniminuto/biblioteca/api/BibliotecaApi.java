package com.uniminuto.biblioteca.api;

import com.uniminuto.biblioteca.model.TestRs;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 *
 * @author lmora
 */
@CrossOrigin(origins = "*")
@RequestMapping("/app")
public interface BibliotecaApi {
    /**
     * Metodo test del servicio.
     *
     * @return Servicio ok.
     * @throws BadRequestException excepcion.
     */
    @RequestMapping(value = "/test",
            produces = {"application/json"},
            consumes = {"application/json"},
            method = RequestMethod.GET)
    ResponseEntity<TestRs> testService()
            throws BadRequestException;
}
