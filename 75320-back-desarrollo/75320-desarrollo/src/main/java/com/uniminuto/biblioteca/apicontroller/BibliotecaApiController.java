package com.uniminuto.biblioteca.apicontroller;

import com.uniminuto.biblioteca.api.BibliotecaApi;
import com.uniminuto.biblioteca.model.TestRs;
import com.uniminuto.biblioteca.services.BibliotecaService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author lmora
 */
@RestController
public class BibliotecaApiController implements BibliotecaApi {
    
    @Autowired
    private BibliotecaService bibliotecaService;

    @Override
    public ResponseEntity<TestRs> testService() throws BadRequestException {       
        return ResponseEntity.ok(this.bibliotecaService.probarApi());
    }

}
