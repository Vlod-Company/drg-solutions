package vvp_company.storeservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vvp_company.storeservice.dto.nested.ItemSearchDTO;
import vvp_company.storeservice.dto.nested.sendItem.SendItemDTO;
import vvp_company.storeservice.dto.response.DeliveryPointResponseDTO;
import vvp_company.storeservice.service.ItemService;

import java.util.List;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

//    @PostMapping("/add/{deliveryPointId}")
//    public void addItemsToDeliveryPoint(
//            @PathVariable Long deliveryPointId,
//            @Valid @RequestBody List<SendItemDTO> items) {
//        itemService.addItemsToDeliveryPoint(deliveryPointId, items);
//    }
//
//    @PostMapping("/{deliveryPointId}")
//    public List<DeliveryPointResponseDTO> findItemsInDeliveryPoint(
//            @PathVariable Long deliveryPointId,
//            @Valid @RequestBody List<ItemSearchDTO> searchItems) {
//        return itemService.findItemsByDeliveryPoint(deliveryPointId, searchItems);
//    }
//
//    @PostMapping
//    public List<DeliveryPointResponseDTO> findItemsAnywhere(
//            @Valid @RequestBody List<ItemSearchDTO> searchItems) {
//        return itemService.findItemsAnywhere(searchItems);
//    }
}