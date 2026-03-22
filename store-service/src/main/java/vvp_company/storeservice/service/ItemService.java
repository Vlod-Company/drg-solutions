package vvp_company.storeservice.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import vvp_company.storeservice.client.DeliveryPointClient;
import vvp_company.storeservice.client.GlossaryServiceClient;
import vvp_company.storeservice.client.dto.DeliveryPointDTO;
import vvp_company.storeservice.client.dto.EquipmentInfoDTO;
import vvp_company.storeservice.client.dto.ResourceInfoDTO;
import vvp_company.storeservice.client.dto.WeaponInfoDTO;
import vvp_company.storeservice.dto.nested.HowMuchAtTimeItem;
import vvp_company.storeservice.dto.nested.ItemResponseDTO;
import vvp_company.storeservice.dto.nested.ItemSearchDTO;
import vvp_company.storeservice.dto.nested.sendItem.*;
import vvp_company.storeservice.dto.request.ReserveCargoRequest;
import vvp_company.storeservice.dto.response.DeliveryPointResponseDTO;
import vvp_company.storeservice.enm.ItemType;
import vvp_company.storeservice.enm.ResourceStatus;
import vvp_company.storeservice.enm.Status;
import vvp_company.storeservice.enm.TeamStatus;
import vvp_company.storeservice.model.Equipment;
import vvp_company.storeservice.model.Resource;
import vvp_company.storeservice.model.Team;
import vvp_company.storeservice.model.Weapon;
import vvp_company.storeservice.repository.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static java.util.stream.Collectors.groupingBy;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static vvp_company.storeservice.enm.ItemType.valueOf;
import static vvp_company.storeservice.enm.ResourceStatus.RESERVED;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final Integer ONE_PERSON_WEIGHT = 50;

    private final EquipmentRepository equipmentRepository;
    private final WeaponRepository weaponRepository;
    private final ResourceRepository resourceRepository;
    private final WarehouseRepository warehouseRepository;
    private final GlossaryServiceClient glossaryServiceClient;
    private final DeliveryPointClient deliveryPointClient;
    private final TeamRepository teamRepository;

    @Transactional
    public List<SendItemDTO> getNonTeamItemsInCargo(Long cargoId) {
        var weapons = weaponRepository.getWeaponsByCargoId(cargoId);
        var equipment = equipmentRepository.getEquipmentByCargoId(cargoId);
        var resources = resourceRepository.getResourcesByCargoId(cargoId);

        var sendItemDtoList = new ArrayList<SendItemDTO>();
        weapons.forEach(w -> sendItemDtoList.add(new SendItemWeapon(w.getName(), w.getIdentificationNumber())));
        equipment.forEach(e -> sendItemDtoList.add(new SendItemEquipment(e.getName(), e.getIdentificationNumber())));
        resources.forEach(r -> sendItemDtoList.add(new SendItemResource(r.getName(), r.getQuantity())));

        return sendItemDtoList;
    }

    @Transactional
    public List<DeliveryPointResponseDTO> findAllInDeliveryPoint(Long deliveryPointId) {
        var items = warehouseRepository.howMuchAtTimeInDeliveryPoint(deliveryPointId, LocalDateTime.now());
        var deliveryPoint = deliveryPointClient.getDeliveryPointById(deliveryPointId);

        var response = howMuchAtTimeItemsToDeliveryPointResponse(items, deliveryPoint);
        if (isNull(response)) {
            throw new ResponseStatusException(NOT_FOUND);
        }
        return List.of(response);
    }

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

    public List<DeliveryPointResponseDTO> findItemsInDeliveryPoint(Long deliveryPointId, List<ItemSearchDTO> items) {
        var searchItemsByType = itemSearchDtoToMap(items);
        var itemInDeliveryPoint = warehouseRepository.howMuchAtTimeInDeliveryPoint(deliveryPointId, LocalDateTime.now()).stream()
                .filter(item -> searchItemsByType.get(item.getItemType()).contains(item.getInfoName()))
                .toList();

        var deliveryPoint = deliveryPointClient.getDeliveryPointById(deliveryPointId);

        var howMuchAtTimeItemsToDeliveryPointResponse = howMuchAtTimeItemsToDeliveryPointResponse(itemInDeliveryPoint, deliveryPoint);
        if (isNull(howMuchAtTimeItemsToDeliveryPointResponse)) {
            throw new ResponseStatusException(NOT_FOUND);
        }
        return List.of(howMuchAtTimeItemsToDeliveryPointResponse);
    }

    @Transactional
    public List<DeliveryPointResponseDTO> findItemsInAllDeliveryPoints(List<ItemSearchDTO> items) {
        var searchItemsByType = itemSearchDtoToMap(items);

        var deliveryPoints = deliveryPointClient.getDeliveryPoints();

        var list = deliveryPoints.stream().map(deliveryPoint -> {
            var itemInDeliveryPoint = warehouseRepository.howMuchAtTimeInDeliveryPoint(deliveryPoint.getId(), LocalDateTime.now()).stream()
                    .filter(item -> Optional.ofNullable(searchItemsByType.get(valueOf(item.getItemType().toUpperCase())))
                            .map((l) -> l.contains(item.getInfoName()))
                            .orElse(false))
                    .toList();

            return howMuchAtTimeItemsToDeliveryPointResponse(itemInDeliveryPoint, deliveryPoint);
        }).filter(Objects::nonNull).toList();
        if (list.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND);
        }
        return list;
    }

    @Transactional
    public void reserveForCargo(ReserveCargoRequest request) {
        var items = request.getData();
        var cargoId = request.getCargoId();
        var locatedAt = request.getLocatedAt();
        items.forEach(item -> {
            switch (item.getTypeName()) {
                case "WEAPON" -> {
                    var weaponItem = (SendItemWeapon) item;
                    var weaponList = weaponRepository.getWeaponsByIdentificationNumber(weaponItem.identificationNumber());
                    if (weaponList.size() != 1) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
                    }

                    var weaponEntity = weaponList.get(0);
                    var weaponWithCargo = Weapon.builder()
                            .cargoId(cargoId)
                            .identificationNumber(weaponEntity.getIdentificationNumber())
                            .name(weaponEntity.getName())
                            .date(LocalDateTime.now())
                            .status(Status.RESERVED)
                            .locatedAt(weaponEntity.getLocatedAt())
                            .build();

                    weaponRepository.save(weaponWithCargo);
                }
                case "EQUIPMENT" -> {
                    var equipmentItem = (SendItemEquipment) item;
                    var equipmentList = equipmentRepository.getEquipmentByIdentificationNumber(equipmentItem.identificationNumber());
                    if (equipmentList.size() != 1) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
                    }

                    var equipmentEntity = equipmentList.get(0);
                    var equipmentWithCargo = Equipment.builder()
                            .cargoId(cargoId)
                            .identificationNumber(equipmentEntity.getIdentificationNumber())
                            .name(equipmentEntity.getName())
                            .date(LocalDateTime.now())
                            .status(Status.RESERVED)
                            .locatedAt(equipmentEntity.getLocatedAt())
                            .build();

                    equipmentRepository.save(equipmentWithCargo);
                }
                case "RESOURCE" -> {
                    var resourceItem = (SendItemResource) item;
                    var lastResource = resourceRepository.findFirstByNameAndLocatedAtAndStatusOrderByDateDesc(resourceItem.itemName(), locatedAt, ResourceStatus.STORED).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));

                    if (lastResource.getQuantity() < resourceItem.quantity()) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
                    }

                    var storedEntity = Resource.builder()
                            .cargoId(cargoId)
                            .status(RESERVED)
                            .date(LocalDateTime.now())
                            .name(lastResource.getName())
                            .quantity(resourceItem.quantity())
                            .locatedAt(locatedAt)
                            .build();
                    resourceRepository.save(storedEntity);

                    if (!Objects.equals(lastResource.getQuantity(), resourceItem.quantity())) {
                        var entity = Resource.builder()
                                .cargoId(null)
                                .status(ResourceStatus.STORED)
                                .date(LocalDateTime.now())
                                .name(lastResource.getName())
                                .quantity(lastResource.getQuantity() - resourceItem.quantity())
                                .locatedAt(locatedAt)
                                .build();
                        resourceRepository.save(entity);
                    }
                }
                case "TEAM" -> {
                    var teamItem = (SendItemTeam) item;

                    var storedTeam = Team.builder()
                            .cargoId(cargoId)
                            .id(teamItem.teamId())
                            .build();
                    teamRepository.save(storedTeam);
                }
            }
        });
    }

    @Transactional
    public void updateStatusForCargo(Long cargoId, Status status) {
        weaponRepository.updateStatusForWeaponsWithCargoId(status, cargoId);
        equipmentRepository.updateStatusForEquipmentWithCargoId(status, cargoId);
        var resourceStatus = ResourceStatus.valueOf(status.name());
        resourceRepository.updateStatusForResourceWithCargoId(resourceStatus, cargoId);
        TeamStatus teamStatus;
        switch (status) {
            case STORED -> teamStatus = TeamStatus.CREATED;
            case RESERVED -> teamStatus = TeamStatus.ASSIGNED;
            case LOST -> teamStatus = TeamStatus.KILLED;
            case DELIVERED -> teamStatus = TeamStatus.DELIVERED;
            case ON_THE_WAY -> teamStatus = TeamStatus.ON_THE_WAY;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        teamRepository.updateStatusForTeamWithCargoId(teamStatus, cargoId);
    }

    @Transactional
    public List<String> getWeaponIds(Long deliveryPointId, String name) {
        var list = weaponRepository.getWeaponsByLocatedAtAndNameAndNotStatus(deliveryPointId, name, Status.STORED);
        if (list.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND);
        }

        return list.stream().map(Weapon::getIdentificationNumber).toList();
    }

    @Transactional
    public List<String> getEquipmentIds(Long deliveryPointId, String name) {
        var list = equipmentRepository.getEquipmentByLocatedAtAndNameAndNotStatus(deliveryPointId, name, Status.STORED);
        if (list.isEmpty()) {
            throw new ResponseStatusException(NOT_FOUND);
        }

        return list.stream().map(Equipment::getIdentificationNumber).toList();
    }

    private Map<ItemType, List<String>> itemSearchDtoToMap(List<ItemSearchDTO> items) {
        return items.stream().collect(groupingBy(
                ItemSearchDTO::getItemType,
                Collectors.mapping(ItemSearchDTO::getItemName, Collectors.toList())
        ));
    }

    private DeliveryPointResponseDTO howMuchAtTimeItemsToDeliveryPointResponse(List<HowMuchAtTimeItem> items, DeliveryPointDTO deliveryPoint) {
        var weaponInfos = glossaryServiceClient.getAllWeaponInfos().stream()
                .collect(groupingBy(WeaponInfoDTO::getName));
        var equipmentInfos = glossaryServiceClient.getAllEquipmentInfos().stream()
                .collect(groupingBy(EquipmentInfoDTO::getName));
        var resourceInfos = glossaryServiceClient.getAllResourceInfos().stream()
                .collect(groupingBy(ResourceInfoDTO::getName));

        var itemDTOs = items.stream().map(item -> {
            var weight = switch(item.getItemType().toUpperCase()) {
                case "WEAPON" -> weaponInfos.get(item.getInfoName()).get(0).getWeight();
                case "RESOURCE" -> resourceInfos.get(item.getInfoName()).get(0).getWeightPerUnit();
                case "EQUIPMENT" -> equipmentInfos.get(item.getInfoName()).get(0).getWeight();
                default -> throw new IllegalStateException("Unexpected value: " + item.getItemType());
            };

            return ItemResponseDTO.builder()
                    .itemQuantity(item.getTotalCount())
                    .itemType(valueOf(item.getItemType().toUpperCase()))
                    .itemName(item.getInfoName())
                    .itemWeight(weight)
                    .build();
        }).toList();

        return !itemDTOs.isEmpty() ? DeliveryPointResponseDTO.builder()
                .deliveryPointType(deliveryPoint.getDeliveryType())
                .deliveryPointId(deliveryPoint.getId())
                .data(itemDTOs)
                .build() : null;
    }
}
