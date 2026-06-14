package br.com.tatu.apoioamulher.dto;

import br.com.tatu.apoioamulher.TypeEnum.Resposta;
import jakarta.persistence.Entity;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class RespostaDto {

    private Resposta opcao;
    private int ponto;


}
