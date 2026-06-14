package br.com.tatu.apoioamulher.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class TokenResponseDTO {

    private String token;
    private String type;
    private long expiration;
}

