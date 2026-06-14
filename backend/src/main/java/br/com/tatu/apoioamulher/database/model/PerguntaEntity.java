package br.com.tatu.apoioamulher.database.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString

@Table(name= "pergunta")
public class PerguntaEntity {


    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pergunta")
    @Id
    private Integer idPergunta;

    private String pergunta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idFormulario", nullable = false)
    private FormularioEntity formulario;



    @OneToMany
    (mappedBy = "perguntaEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RespostaEntity> respostas = new ArrayList<>();



}
