package br.com.tatu.apoioamulher.service;

import br.com.tatu.apoioamulher.TypeEnum.RoleTypeEnum;
import br.com.tatu.apoioamulher.config.TokenProvider;
import br.com.tatu.apoioamulher.database.model.RolesEntity;
import br.com.tatu.apoioamulher.database.model.UsuarioEntity;
import br.com.tatu.apoioamulher.database.repository.RolesRepository;
import br.com.tatu.apoioamulher.database.repository.UsuarioRepository;
import br.com.tatu.apoioamulher.dto.LoginRequestDto;
import br.com.tatu.apoioamulher.dto.RegisterRequestDto;
import br.com.tatu.apoioamulher.dto.TokenResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@RequiredArgsConstructor
@Service
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final RolesRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    @Value("${jwt.expiration}")
    private long expirationTime;

    public void register(RegisterRequestDto dto) {

        UsuarioEntity usuario = usuarioRepository.findByEmail(dto.getEmail())
                .orElse(null);

        if (usuario != null) {
            throw new IllegalArgumentException("Usuario já cadastrado com esse email");
        }

        RolesEntity role = rolesRepository.findBynome(RoleTypeEnum.ROLE_PADRAO.name())
                .orElseGet(() -> rolesRepository.save(RolesEntity.builder()
                        .nome(RoleTypeEnum.ROLE_PADRAO.name())
                        .build()
                ));

        usuarioRepository.save(UsuarioEntity.builder()
                .email(dto.getEmail())
                .senha(passwordEncoder.encode(dto.getSenha()))
                .roles(Set.of(role))
                .build());
    }

    public TokenResponseDTO login(LoginRequestDto loginDto) throws Exception {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getSenha())
            );

            String token = tokenProvider.gerarToken(authentication);

            return TokenResponseDTO.builder()
                    .token(token)
                    .type("Bearer")
                    .expiration(expirationTime)
                    .build();

        } catch (BadCredentialsException e) {
            throw new IllegalArgumentException("Credenciais inválidas");
        } catch (Exception e) {
            throw new Exception("Erro interno inesperado: " + e.getMessage());
        }
    }
}