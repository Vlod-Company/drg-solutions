package vvp_company.storeservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vvp_company.storeservice.dto.nested.sendItem.SendItemDTO;
import vvp_company.storeservice.dto.nested.sendItem.SendItemEquipment;
import vvp_company.storeservice.dto.nested.sendItem.SendItemResource;
import vvp_company.storeservice.dto.nested.sendItem.SendItemWeapon;
import vvp_company.storeservice.model.Equipment;
import vvp_company.storeservice.repository.EquipmentRepository;
import vvp_company.storeservice.repository.ResourceRepository;
import vvp_company.storeservice.repository.WeaponRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final EquipmentRepository equipmentRepository;
    private final WeaponRepository weaponRepository;
    private final ResourceRepository resourceRepository;

    @Transactional
    public void addItemsToDeliveryPoint(Long deliveryPointId, List<SendItemDTO> items) {
        List<SendItemEquipment> equipmentList = new ArrayList<>();
        List<SendItemResource> resourceList = new ArrayList<>();
        List<SendItemWeapon> weaponList = new ArrayList<>();

        items.forEach(item -> {
            switch (item.getTypeName()) {
                case "EQUIPMENT" -> equipmentList.add((SendItemEquipment) item);
                case "WEAPON" -> weaponList.add((SendItemWeapon) item);
                case "RESOURCE" -> resourceList.add((SendItemResource) item);
            }
        });

        
    }
}
