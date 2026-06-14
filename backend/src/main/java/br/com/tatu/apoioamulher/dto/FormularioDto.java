package br.com.tatu.apoioamulher.dto;

import jakarta.persistence.Entity;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class FormularioDto {

    private String descricao;
    private String nome;

}
