package br.com.tatu.apoioamulher.service;

import br.com.tatu.apoioamulher.TypeEnum.Resposta;
import br.com.tatu.apoioamulher.database.model.RespostaEntity;
import br.com.tatu.apoioamulher.database.repository.RespostaRepository;
import br.com.tatu.apoioamulher.dto.AvaliacaoRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RespostaService {

    private final RespostaRepository respostaRepository;

    public RespostaEntity salvar(RespostaEntity resposta) {
        return respostaRepository.save(resposta);
    }

    public List<RespostaEntity> listar() {
        return respostaRepository.findAll();
    }

    public RespostaEntity buscarPorId(Integer id) {
        return respostaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resposta não encontrada."));
    }

    public void deletarPorId(Integer id) {
        respostaRepository.deleteById(id);
    }

    public Map<String, Object> calcularToxicidade(AvaliacaoRequestDto request) {

        // Validação: Garante que exatamente 15 respostas foram enviadas
        if (request.getRespostasEscolhidas() == null || request.getRespostasEscolhidas().size() != 15) {
            throw new IllegalArgumentException("A avaliação deve conter exatamente 15 respostas.");
        }

        int pontuacaoTotal = 0;

        for (Resposta escolha : request.getRespostasEscolhidas()) {
            pontuacaoTotal += escolha.getPeso();
        }

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("pontuacaoTotal", pontuacaoTotal);

        // Nova lógica baseada em 15 perguntas (Máximo de 30 pontos)
        if (pontuacaoTotal <= 4) {
            resultado.put("nivelToxicidade", "Relação Aparentemente Saudável");
            resultado.put("orientacao", "Continue atenta aos seus limites.");
        } else if (pontuacaoTotal <= 11) {
            resultado.put("nivelToxicidade", "Sinais de Alerta (Bandeira Amarela)");
            resultado.put("orientacao", "Há comportamentos que merecem atenção. Não normalize atitudes que te machucam.");
        } else {
            resultado.put("nivelToxicidade", "Relação Tóxica / Abusiva (Bandeira Vermelha)");
            resultado.put("orientacao", "Procure apoio profissional, converse com pessoas de confiança ou ligue 180.");
        }

        return resultado;
    }
}