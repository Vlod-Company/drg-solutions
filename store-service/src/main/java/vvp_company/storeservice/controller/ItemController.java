package vvp_company.storeservice.controller;

import jakarta.validation.Valid;
import jakarta.ws.rs.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vvp_company.storeservice.dto.nested.ItemSearchDTO;
import vvp_company.storeservice.dto.nested.sendItem.SendItemDTO;
import vvp_company.storeservice.dto.request.ReserveCargoRequest;
import vvp_company.storeservice.dto.response.DeliveryPointResponseDTO;
import vvp_company.storeservice.enm.Status;
import vvp_company.storeservice.service.ItemService;

import java.util.List;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE')")
    @PostMapping("/add/{deliveryPointId}")
    public void addItemsToDeliveryPoint(
            @PathVariable Long deliveryPointId,
            @Valid @RequestBody List<SendItemDTO> items) {
        itemService.addItemsToDeliveryPoint(deliveryPointId, items);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE')")
    @GetMapping("/getCargoItems/{cargoId}")
    public List<SendItemDTO> getNonTeamItemsInCargo(@PathVariable Long cargoId) {
        return itemService.getNonTeamItemsInCargo(cargoId);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE')")
    @PostMapping("/{deliveryPointId}")
    public List<DeliveryPointResponseDTO> findItemsInDeliveryPoint(
            @PathVariable Long deliveryPointId,
            @Valid @RequestBody List<ItemSearchDTO> searchItems) {
        return itemService.findItemsInDeliveryPoint(deliveryPointId, searchItems);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE')")
    @PostMapping("/{deliveryPointId}/all")
    public List<DeliveryPointResponseDTO> findItemsInAllDeliveryPoints(
            @PathVariable Long deliveryPointId
    ){
        return itemService.findAllInDeliveryPoint(deliveryPointId);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE')")
    @PostMapping
    public List<DeliveryPointResponseDTO> findItemsAnywhere(
            @Valid @RequestBody List<ItemSearchDTO> searchItems) {
        return itemService.findItemsInAllDeliveryPoints(searchItems);
    }

    @GetMapping("/{deliveryPointId}/getWeaponIds")
    public List<String> getWeaponIds(@PathVariable Long deliveryPointId, @PathParam("name") String name) {
        return itemService.getWeaponIds(deliveryPointId, name);
    }

    @GetMapping("/{deliveryPointId}/getEquipmentIds")
    public List<String> getEquipmentIds(@PathVariable Long deliveryPointId, @PathParam("name") String name) {
        return itemService.getEquipmentIds(deliveryPointId, name);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE')")
    @PostMapping("/reserveCargo")
    public void reserveForCargo(@RequestBody ReserveCargoRequest request) {
        itemService.reserveForCargo(request);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN') " +
            "or hasRole('ROLE_LAUNCH_CONTROL_EMPLOYEE')")
    @PutMapping("/changeStatusForCargo/{id}")
    public void changeStatusForCargo(@PathVariable Long id, @RequestParam Status status) {
        itemService.updateStatusForCargo(id, status);
    }
}