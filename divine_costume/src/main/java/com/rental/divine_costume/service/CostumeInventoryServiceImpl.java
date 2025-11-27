package com.rental.divine_costume.service;

import com.rental.divine_costume.dto.requestdto.CostumePartRequestDto;
import com.rental.divine_costume.dto.responsedto.CostumeInventoryResponseDto;
import com.rental.divine_costume.entity.items.*;
import com.rental.divine_costume.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CostumeInventoryServiceImpl implements CostumeInventoryService {

    private final CostumeCategoryRepository categoryRepository;
    private final CostumeVariantRepository variantRepository;
    private final CostumeRepository costumeRepository;
    private final CostumePartRepository costumePartRepository;
    private final CostumeImageRepository imageRepository;

    @Value("${app.base-url}")
    private String baseUrl; // Used to build full image URL

    @Override
    @Transactional(readOnly = true)
    public List<CostumeCategory> getAllCategories() {
        log.info("Fetching all costume categories");
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CostumeVariant> getVariantsByCategory(Long categoryId) {
        log.info("Fetching variants for category ID: {}", categoryId);
        List<CostumeVariant> variants = variantRepository.findByCategoryId(categoryId);

        Map<String, CostumeVariant> deduped = new LinkedHashMap<>();
        for (CostumeVariant variant : variants) {
            String key = Optional.ofNullable(variant.getVariantDescription())
                    .orElse("")
                    .trim()
                    .toLowerCase();
            deduped.putIfAbsent(key, variant);
        }

        return new ArrayList<>(deduped.values());
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getSizesByVariant(Long variantId) {
        log.info("Fetching sizes for variant ID: {}", variantId);
        return costumeRepository.findDistinctSizesByVariantId(variantId);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getSizeCountsByVariant(Long variantId) {
        log.info("Fetching size counts for logical variant (by description) for variant ID: {}", variantId);

        CostumeVariant baseVariant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found with ID: " + variantId));

        Long categoryId = baseVariant.getCategory() != null ? baseVariant.getCategory().getId() : null;
        String description = baseVariant.getVariantDescription();

        if (categoryId == null || description == null) {
            List<String> sizes = getSizesByVariant(variantId);
            Map<String, Long> fallback = new HashMap<>();
            for (String size : sizes) {
                Long count = costumeRepository.countAvailableByVariantIdAndSize(variantId, size);
                fallback.put(size, count);
            }
            return fallback;
        }

        List<CostumeVariant> relatedVariants = variantRepository
                .findByCategoryIdAndVariantDescriptionIgnoreCase(categoryId, description.trim());

        Map<String, Long> aggregated = new HashMap<>();

        for (CostumeVariant variant : relatedVariants) {
            Long vId = variant.getId();
            if (vId == null) continue;

            List<String> sizes = getSizesByVariant(vId);
            for (String rawSize : sizes) {
                String displaySize = rawSize == null ? "" : rawSize.trim();
                if (displaySize.isEmpty()) continue;

                Long existing = aggregated.getOrDefault(displaySize, 0L);
                Long count = costumeRepository.countAvailableByVariantIdAndSize(vId, displaySize);
                aggregated.put(displaySize, existing + (count != null ? count : 0L));
            }
        }

        return aggregated;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CostumeInventoryResponseDto> getInventoryByCategory(Long categoryId) {
        log.info("Fetching inventory for category ID: {}", categoryId);
        List<Costume> costumes = costumeRepository.findByCategoryId(categoryId);
        return mapToInventoryResponseDto(costumes);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CostumeInventoryResponseDto> getInventoryByVariant(Long variantId) {
        log.info("Fetching inventory for variant ID: {}", variantId);
        List<Costume> costumes = costumeRepository.findByVariantId(variantId);
        return mapToInventoryResponseDto(costumes);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CostumeInventoryResponseDto> getInventoryByVariantAndSize(Long variantId, String size) {
        log.info("Fetching inventory for variant ID: {} and size: {}", variantId, size);
        List<Costume> costumes = costumeRepository.findByVariantIdAndSize(variantId, size);
        return mapToInventoryResponseDto(costumes);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getAvailableCount(Long variantId, String size) {
        log.info("Getting available count for variant ID: {} and size: {}", variantId, size);
        return costumeRepository.countAvailableByVariantIdAndSize(variantId, size);
    }

    @Override
    public void updateInventoryCount(Long costumeId, Integer newCount) {
        log.info("Updating inventory count for costume ID: {} to: {}", costumeId, newCount);
        Costume costume = costumeRepository.findById(costumeId)
                .orElseThrow(() -> new RuntimeException("Costume not found with ID: " + costumeId));
        costume.setNumberOfItems(newCount);
        costumeRepository.save(costume);
        log.info("Successfully updated inventory count for costume ID: {}", costumeId);
    }

    @Override
    public Long addCostumePart(CostumePartRequestDto requestDto) {
        log.info("Adding costume part for costume ID: {}", requestDto.getParentCostumeId());
        Costume costume = costumeRepository.findById(requestDto.getParentCostumeId())
                .orElseThrow(() -> new RuntimeException("Parent costume not found with ID: " + requestDto.getParentCostumeId()));

        CostumePart costumePart = CostumePart.builder()
                .parentCostume(costume)
                .partName(requestDto.getPartName())
                .partDescription(requestDto.getPartDescription())
                .quantity(requestDto.getQuantity())
                .isEssential(requestDto.getIsEssential() != null ? requestDto.getIsEssential() : false)
                .partType(requestDto.getPartType())
                .notes(requestDto.getNotes())
                .build();

        CostumePart savedPart = costumePartRepository.save(costumePart);
        log.info("Successfully added costume part with ID: {}", savedPart.getId());
        return savedPart.getId();
    }

    @Override
    public void removeCostumePart(Long partId) {
        log.info("Removing costume part with ID: {}", partId);
        if (!costumePartRepository.existsById(partId)) {
            throw new RuntimeException("Costume part not found with ID: " + partId);
        }
        costumePartRepository.deleteById(partId);
        log.info("Successfully removed costume part with ID: {}", partId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getSerialNumbersByVariantAndSize(Long variantId, String size) {
        log.info("Fetching serial numbers for variant ID: {} and size: {}", variantId, size);
        return costumeRepository.findByVariantIdAndSize(variantId, size)
                .stream()
                .map(costume -> "SN" + costume.getSerialNumber())
                .collect(Collectors.toList());
    }

    private List<CostumeInventoryResponseDto> mapToInventoryResponseDto(List<Costume> costumes) {
        Map<String, List<Costume>> groupedCostumes = costumes.stream()
                .collect(Collectors.groupingBy(costume -> {
                    CostumeVariant variant = costume.getCostumeVariant();
                    String categoryIdPart = (variant.getCategory() != null)
                            ? String.valueOf(variant.getCategory().getId())
                            : "null";
                    String descPart = Optional.ofNullable(variant.getVariantDescription())
                            .orElse("")
                            .trim()
                            .toLowerCase();
                    String sizePart = Optional.ofNullable(costume.getSize())
                            .orElse("")
                            .trim()
                            .toLowerCase();
                    return categoryIdPart + "_" + descPart + "_" + sizePart;
                }));

        return groupedCostumes.entrySet().stream()
                .map(entry -> {
                    List<Costume> costumeGroup = entry.getValue();
                    Costume firstCostume = costumeGroup.get(0);
                    CostumeVariant variant = firstCostume.getCostumeVariant();

                    String imageUrl = null;
                    if (variant.getImages() != null && !variant.getImages().isEmpty()) {
                        imageUrl = variant.getImages().get(0).getImageUrl(); // real stored path
                    }

                    // Convert path to exposed API usable URL
                    if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                        imageUrl = baseUrl + "/api/files/display?path=" + imageUrl;
                    } else {
                        // fallback
                        imageUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGOUZBIiBzdHJva2U9IiNEREREREQiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0yMSAxNS02LTYtNiA2Ii8+CjxwYXRoIGQ9Im05IDlhMyAzIDAgMSAwIDYgMGEzIDMgMCAwIDAtNiAweiIvPgo8L3N2Zz4KPC9zdmc+";
                    }

                    return CostumeInventoryResponseDto.builder()
                            .id(firstCostume.getId())
                            .categoryName(variant.getCategory().getCategoryName())
                            .variantDescription(variant.getVariantDescription())
                            .size(firstCostume.getSize())
                            .count(costumeGroup.size())
                            .imageUrl(imageUrl)
                            .serialNumbers(costumeGroup.stream()
                                    .map(costume -> "SN" + costume.getSerialNumber())
                                    .collect(Collectors.toList()))
                            .style(variant.getStyle())
                            .primaryColor(variant.getPrimaryColor())
                            .secondaryColor(variant.getSecondaryColor())
                            .tertiaryColor(variant.getTertiaryColor())
                            .build();
                }).collect(Collectors.toList());
    }
}
