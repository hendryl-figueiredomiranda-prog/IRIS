package br.com.tatu.apoioamulher.database.model;

import br.com.tatu.apoioamulher.TypeEnum.Resposta;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString(exclude = "perguntaEntity")
@Entity
@Table(name = "respostas")
public class RespostaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_resposta")
    private Integer idResposta;


    @Enumerated(EnumType.STRING)
    private Resposta opcao;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_pergunta", nullable = false)
    private PerguntaEntity perguntaEntity;

}