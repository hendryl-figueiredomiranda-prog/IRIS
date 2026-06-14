package br.com.tatu.apoioamulher.dto;

import br.com.tatu.apoioamulher.TypeEnum.Resposta;
import lombok.Data;
import java.util.List;

@Data
public class AvaliacaoRequestDto {
    private List<Resposta> respostasEscolhidas;
}
