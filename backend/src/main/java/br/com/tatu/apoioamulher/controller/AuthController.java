package br.com.tatu.apoioamulher.controller;

import br.com.tatu.apoioamulher.dto.LoginRequestDto;
import br.com.tatu.apoioamulher.dto.RegisterRequestDto;
import br.com.tatu.apoioamulher.dto.TokenResponseDTO;
import br.com.tatu.apoioamulher.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponseDTO login(@RequestBody LoginRequestDto loginDto) throws Exception {
        return authenticationService.login(loginDto);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody RegisterRequestDto dto) {
        authenticationService.register(dto);
    }
}
