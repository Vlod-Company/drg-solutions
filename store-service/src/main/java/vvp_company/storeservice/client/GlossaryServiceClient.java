package vvp_company.storeservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import vvp_company.storeservice.client.dto.EquipmentInfoDTO;
import vvp_company.storeservice.client.dto.ResourceInfoDTO;
import vvp_company.storeservice.client.dto.WeaponInfoDTO;

import java.util.List;

@FeignClient(
        name = "glossary-service",
        path = "glossary-service"
)
public interface GlossaryServiceClient {

    @GetMapping("resourceInfo/all")
    List<ResourceInfoDTO> getAllResourceInfos();

    @GetMapping("equipmentInfo/all")
    List<EquipmentInfoDTO> getAllEquipmentInfos();

    @GetMapping("weaponInfo/all")
    List<WeaponInfoDTO> getAllWeaponInfos();
}
