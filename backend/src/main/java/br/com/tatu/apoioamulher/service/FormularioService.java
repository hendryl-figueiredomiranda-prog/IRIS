package br.com.tatu.apoioamulher.service;

import br.com.tatu.apoioamulher.database.model.FormularioEntity;
import br.com.tatu.apoioamulher.database.repository.FormularioRepository;
import br.com.tatu.apoioamulher.dto.FormularioDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FormularioService {

    private final FormularioRepository formularioRepository;

    public void salvar(FormularioDto dto){
        formularioRepository.save(FormularioEntity.builder()
                .nome(dto.getNome())
                .descricao(dto.getDescricao())
                .build());
    }

    public void deleteByNomeContainingIgnoreCase(String nome){
        formularioRepository.deleteByNomeContainingIgnoreCase(nome);
    }

    public void deleteByid(Integer idFormulario){
        formularioRepository.deleteById(idFormulario);
    }

    public FormularioEntity findByNomeContainingIgnoreCase(String nome){
        return formularioRepository.findByNomeContainingIgnoreCase(nome).orElseThrow(()-> new RuntimeException("Fórmulario não encontrado"));
    }

    public List<FormularioEntity> findAllFormularioEntity(){
        return formularioRepository.findAll();
    }

    public void atualizarPorId(Integer id,  FormularioEntity formulario) {
        FormularioEntity formularioEntity = formularioRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Formulário não encontrado"));
        FormularioEntity formularioAtualizado = FormularioEntity.builder()
                .nome(formulario.getNome() != null ? formulario.getNome() :
                        formularioEntity.getNome())
                .descricao(formulario.getDescricao() != null ? formulario.getDescricao() :
                        formularioEntity.getDescricao())
                .build();
    }








}
