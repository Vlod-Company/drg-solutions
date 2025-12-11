package vvp_company.storeservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vvp_company.storeservice.dto.nested.sendItem.SendItemDTO;
import vvp_company.storeservice.dto.nested.sendItem.SendItemEquipment;
import vvp_company.storeservice.dto.nested.sendItem.SendItemResource;
import vvp_company.storeservice.dto.nested.sendItem.SendItemWeapon;
import vvp_company.storeservice.dto.response.DeliveryPointResponseDTO;
import vvp_company.storeservice.enm.ResourceStatus;
import vvp_company.storeservice.enm.Status;
import vvp_company.storeservice.model.Equipment;
import vvp_company.storeservice.model.Resource;
import vvp_company.storeservice.model.Weapon;
import vvp_company.storeservice.repository.EquipmentRepository;
import vvp_company.storeservice.repository.ResourceRepository;
import vvp_company.storeservice.repository.WareHouseRepository;
import vvp_company.storeservice.repository.WeaponRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final EquipmentRepository equipmentRepository;
    private final WeaponRepository weaponRepository;
    private final ResourceRepository resourceRepository;
    private final WareHouseRepository wareHouseRepository;

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

        equipmentList.forEach(equipment -> {
            var entity = Equipment.builder()
                    .name(equipment.itemName())
                    .identificationNumber(equipment.identificationNumber())
                    .locatedAt(deliveryPointId)
                    .status(Status.STORED)
                    .date(LocalDateTime.now())
                    .build();

            equipmentRepository.save(entity);
        });

        weaponList.forEach(weapon -> {
            var entity = Weapon.builder()
                    .name(weapon.itemName())
                    .identificationNumber(weapon.identificationNumber())
                    .locatedAt(deliveryPointId)
                    .status(Status.STORED)
                    .date(LocalDateTime.now())
                    .build();

            weaponRepository.save(entity);
        });

        resourceList.forEach(resource -> {
            var lastResourceCount = resourceRepository
                    .findFirstByLocatedAtAndNameAndStatusOrderByDateDesc(deliveryPointId, resource.itemName(), ResourceStatus.STORED)
                    .map(Resource::getQuantity)
                    .orElse(0);

            var entity = Resource.builder()
                    .name(resource.itemName())
                    .quantity(resource.quantity() + lastResourceCount)
                    .locatedAt(deliveryPointId)
                    .date(LocalDateTime.now())
                    .status(ResourceStatus.STORED)
                    .build();

            resourceRepository.save(entity);
        });
    }

//    public List<DeliveryPointResponseDTO> findItemsInDeliveryPoint(Long deliveryPointId) {
//        var items = wareHouseRepository.howMuchAtTimeInDeliveryPoint(deliveryPointId, LocalDateTime.now());
//
//    }
}
