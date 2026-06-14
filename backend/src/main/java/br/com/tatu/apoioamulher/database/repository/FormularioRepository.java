package br.com.tatu.apoioamulher.database.repository;

import br.com.tatu.apoioamulher.database.model.FormularioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface FormularioRepository extends JpaRepository<FormularioEntity,Integer >{
    @Transactional
    void deleteByNomeContainingIgnoreCase(String nome);
    @Transactional
    void deleteById(Integer idFormulario);

    Optional<FormularioEntity>  findByNomeContainingIgnoreCase(String nome);


}
