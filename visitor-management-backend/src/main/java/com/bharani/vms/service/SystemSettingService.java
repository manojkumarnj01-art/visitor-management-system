package com.bharani.vms.service;

import com.bharani.vms.entity.SystemSetting;
import com.bharani.vms.repository.SystemSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SystemSettingService {

    private final SystemSettingRepository systemSettingRepository;

    public List<SystemSetting> getAllSettings() {
        return systemSettingRepository.findAll();
    }

    public Optional<SystemSetting> getSettingByKey(String key) {
        return systemSettingRepository.findByKey(key);
    }

    public SystemSetting saveSetting(SystemSetting setting) {
        Optional<SystemSetting> existing = systemSettingRepository.findByKey(setting.getKey());
        if (existing.isPresent()) {
            SystemSetting s = existing.get();
            s.setValue(setting.getValue());
            return systemSettingRepository.save(s);
        }
        return systemSettingRepository.save(setting);
    }

    public void deleteSetting(UUID id) {
        systemSettingRepository.deleteById(id);
    }
}
