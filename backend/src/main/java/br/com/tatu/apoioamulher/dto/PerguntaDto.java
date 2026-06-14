package br.com.tatu.apoioamulher.dto;

import br.com.tatu.apoioamulher.database.model.FormularioEntity;
import jakarta.persistence.Entity;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
public class PerguntaDto {
    private String pergunta;
    private FormularioEntity formulario;
}
