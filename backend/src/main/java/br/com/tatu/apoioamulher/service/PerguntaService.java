package br.com.tatu.apoioamulher.service;

import br.com.tatu.apoioamulher.database.model.FormularioEntity;
import br.com.tatu.apoioamulher.database.model.PerguntaEntity;
import br.com.tatu.apoioamulher.database.repository.FormularioRepository;
import br.com.tatu.apoioamulher.database.repository.PerguntaRepository;
import br.com.tatu.apoioamulher.dto.PerguntaDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerguntaService {

    private final PerguntaRepository perguntaRepository;
    private final FormularioRepository formularioRepository;

    public void criarPergunta(Integer idFormulario, PerguntaDto dto) {
        FormularioEntity formularioPai = formularioRepository.findById(idFormulario)
                .orElseThrow(() -> new RuntimeException("Formulário não encontrado"));

        perguntaRepository.save(PerguntaEntity.builder()
                .pergunta(dto.getPergunta())
                .formulario(formularioPai)
                .build());
    }

    public List<PerguntaEntity> listar() {
        return perguntaRepository.findAll();
    }

    public void deleteById(Integer id) {
        perguntaRepository.deleteById(id);
    }

    public PerguntaEntity findyById(Integer id) {
        return perguntaRepository.findById(id).orElseThrow(() -> new RuntimeException("pergunta Não encontrada"));
    }


    public void atualizarPorId(Integer id, PerguntaEntity perguntaRequest) {
        PerguntaEntity perguntaExistente = perguntaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pergunta não encontrada"));
        PerguntaEntity perguntaAtualizada = PerguntaEntity.builder()
                .idPergunta(perguntaExistente.getIdPergunta())
                .formulario(perguntaExistente.getFormulario())
                .respostas(perguntaExistente.getRespostas())
                .pergunta(perguntaRequest.getPergunta() != null ? perguntaRequest.getPergunta() :
                        perguntaExistente.getPergunta())
                .build();
        perguntaRepository.save(perguntaAtualizada);
    }


}
