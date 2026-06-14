package br.com.tatu.apoioamulher.database.repository;

import br.com.tatu.apoioamulher.database.model.PerguntaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerguntaRepository extends JpaRepository<PerguntaEntity,Integer> {

    @Override
    Optional<PerguntaEntity> findById(Integer id);
}
