package br.com.tatu.apoioamulher.dto;



import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString


public class RegisterRequestDto {

    @NotBlank
    private String email;

    @NotBlank
    private String senha;



}

