package vvp_company.glossaryservice.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import vvp_company.glossaryservice.model.ImpactType;

import java.util.List;

@Repository
public interface ImpactTypeRepository extends CrudRepository<ImpactType,Long> {

    @Override
    List<ImpactType> findAll();
}
