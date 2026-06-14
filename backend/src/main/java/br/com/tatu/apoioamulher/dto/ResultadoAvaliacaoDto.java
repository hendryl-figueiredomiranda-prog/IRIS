package br.com.tatu.apoioamulher.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResultadoAvaliacaoDto {
    private int pontuacaoTotal;
    private String nivelToxicidade;
    private String orientacao;
}