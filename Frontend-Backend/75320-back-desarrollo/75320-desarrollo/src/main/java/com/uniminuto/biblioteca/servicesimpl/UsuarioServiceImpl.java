package com.uniminuto.biblioteca.servicesimpl;

import com.uniminuto.biblioteca.entity.Usuario;
import com.uniminuto.biblioteca.model.RespuestaGenerica;
import com.uniminuto.biblioteca.model.UsuarioRq;
import com.uniminuto.biblioteca.repository.UsuarioRepository;
import com.uniminuto.biblioteca.services.UsuarioService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author lmora
 */
@Service
public class UsuarioServiceImpl implements UsuarioService {

    /**
     * Patron para validar email.
     */
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

    /**
     * Regex para validacion de email.
     */
    private static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    /**
     * Repositorio de usuario.
     */
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public List<Usuario> listarTodo() throws BadRequestException {
        return this.usuarioRepository.findAll();
    }

    @Override
    public Usuario buscarPorCorreo(String correo) throws BadRequestException {
        if (correo == null || correo.isBlank()) {
            throw new BadRequestException("El correo: " + correo + ", no cumple "
                    + "la validación para ser un correo valido.");
        }

        boolean isValidoEmail = this.validarCorreo(correo);
        if (!isValidoEmail) {
            throw new BadRequestException("El correo no es valido.");
        }

        Optional<Usuario> optUsuario = this.usuarioRepository
                .findByCorreo(correo);
        if (!optUsuario.isPresent()) {
            throw new BadRequestException("No hay registros de usuarios "
                    + "registrados con el correo ingresado.");
        }
        return optUsuario.get();
    }

    /**
     *
     * @param correo
     * @return
     */
    public boolean validarCorreo(String correo) {
        if (correo == null || correo.isBlank()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(correo).matches();
    }

    @Override
    public RespuestaGenerica guardarUsuario(UsuarioRq usuario)
            throws BadRequestException {
        Optional<Usuario> optUser = this.usuarioRepository
                .findByNombre(usuario.getNombre());
        if (optUser.isPresent()) {
            throw new BadRequestException("El usuario se encuentra registrado con el nombre: "
                    + usuario.getNombre() + ". Valide e intente de nuevo.");
        }

        optUser = this.usuarioRepository
                .findByCorreo(usuario.getCorreo());
        if (optUser.isPresent()) {
            throw new BadRequestException("El usuario se encuentra registrado con el correo: "
                    + usuario.getCorreo() + ". Valide e intente de nuevo.");
        }

        Usuario userToSave = this.transformarUsuarioRqToUsuario(usuario);
        this.usuarioRepository.save(userToSave);
        RespuestaGenerica rta = new RespuestaGenerica();
        rta.setMessage("Se ha guardado el usuario satisfactoriamente.");
        return rta;
    }

    private Usuario transformarUsuarioRqToUsuario(UsuarioRq usuario) {
        Usuario user = new Usuario();
        user.setActivo(Boolean.TRUE);
        user.setCorreo(usuario.getCorreo());
        user.setFechaRegistro(LocalDateTime.now());
        user.setNombre(usuario.getNombre());
        user.setTelefono(usuario.getTelefono());
        return user;
    }

    @Override
    public RespuestaGenerica actualizarUsuario(Usuario usuario)
            throws BadRequestException {
        //Paso 1.
        Optional<Usuario> userOpt = this.usuarioRepository
                .findById(usuario.getIdUsuario());
        if (!userOpt.isPresent()) {
            throw new BadRequestException("No existe el usuario.");
        }
        RespuestaGenerica rta = new RespuestaGenerica();
        rta.setMessage("Se ha actualizado el usuario.");
        Usuario userActual = userOpt.get();
        if (!this.hayCambios(userActual, usuario)) {
            // Paso 3.
            return rta;
        }

        // Paso 4 y paso 5
        if (!userActual.getNombre().equals(usuario.getNombre())) {
            // Consulto si existe el nombre en la bd
            // Si existe lanzo excepcion
            if (this.usuarioRepository.existsByNombre(usuario.getNombre())) {
                throw new BadRequestException("El usuario ya se encuentra registrado con el "
                        + "nombre " + usuario.getNombre());
            }
        }

        // paso 6.
        if (!userActual.getCorreo().equals(usuario.getCorreo())) {
            // COnsulto el correo en la bd
            // Si existe lanzo excepcion
            if (this.usuarioRepository.existsByCorreo(usuario.getCorreo())) {
                throw new BadRequestException("El correo ya se encuentra registrado "
                        + usuario.getCorreo());
            }
        }
        userActual.setActivo(usuario.getActivo());
        userActual.setNombre(usuario.getNombre());
        userActual.setCorreo(usuario.getCorreo());
        userActual.setTelefono(usuario.getTelefono());

        this.usuarioRepository.save(userActual);
        return rta;
    }

    private boolean hayCambios(Usuario usuarioActual, Usuario usuario) {
        if (!usuarioActual.getNombre().equals(usuario.getNombre())) {
            return true;
        }
        if (!usuarioActual.getTelefono().equals(usuario.getTelefono())) {
            return true;
        }
        if (!usuarioActual.getCorreo().equals(usuario.getCorreo())) {
            return true;
        }
        if (!usuarioActual.getActivo().equals(usuario.getActivo())) {
            return true;
        }
        return false;
    }

}
