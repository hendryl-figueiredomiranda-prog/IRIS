package br.com.tatu.apoioamulher.database.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@ToString
@Entity
@Builder

@Table(name="formulario")
public class FormularioEntity {

    private String descricao;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFormulario;
    private String nome;

    @OneToMany
    (mappedBy = "formulario", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PerguntaEntity> perguntas = new ArrayList<>();




}
