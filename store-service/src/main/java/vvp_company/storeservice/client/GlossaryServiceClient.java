package vvp_company.storeservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import vvp_company.storeservice.client.dto.EquipmentInfoDTO;
import vvp_company.storeservice.client.dto.ResourceInfoDTO;
import vvp_company.storeservice.client.dto.WeaponInfoDTO;

@FeignClient(
        url = "${services.glossary.base-url}",
        name = "glossary-service"
)
public interface GlossaryServiceClient {

    @GetMapping("resourceInfo")
    ResourceInfoDTO getResourceInfoByName(@RequestParam("resourceName") String name);

    @GetMapping("equipmentInfo")
    EquipmentInfoDTO getEquipmentInfoByName(@RequestParam("equipmentName") String name);

    @GetMapping("weapongInfo")
    WeaponInfoDTO getWeaponInfoByName(@RequestParam("weaponName") String name);
}
