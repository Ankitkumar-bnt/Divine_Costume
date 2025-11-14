package com.rental.divine_costume.service;

import com.rental.divine_costume.dto.requestdto.*;
import com.rental.divine_costume.dto.responsedto.*;
import com.rental.divine_costume.entity.items.*;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import com.rental.divine_costume.mapper.*;
import com.rental.divine_costume.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    // Inject all repositories
    private final CostumeCategoryRepository categoryRepository;
    private final CostumeVariantRepository variantRepository;
    private final CostumeRepository costumeRepository;
    private final CostumeItemRepository itemRepository;
    private final CostumeImageRepository imageRepository;

    // Inject all mappers
    private final CostumeCategoryMapper categoryMapper;
    private final CostumeVariantMapper variantMapper;
    private final CostumeMapper costumeMapper;
    private final CostumeItemMapper itemMapper;
    private final CostumeImageMapper imageMapper;
    private final ItemMapper fullMapper;

    // ---------- CATEGORY ----------
    @Override
    public CostumeCategoryResponseDto addCategory(CostumeCategoryRequestDto dto) {
        CostumeCategory entity = categoryMapper.toEntity(dto);
        return categoryMapper.toResponseDto(categoryRepository.save(entity));
    }

    @Override
    public List<CostumeCategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll()
                .stream().map(categoryMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    // ---------- VARIANT ----------
    @Override
    public CostumeVariantResponseDto addVariant(CostumeVariantRequestDto dto) {
        CostumeVariant entity = variantMapper.toEntity(dto);
        return variantMapper.toResponseDto(variantRepository.save(entity));
    }

    @Override
    public List<CostumeVariantResponseDto> getAllVariants() {
        return variantRepository.findAll()
                .stream().map(variantMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    // ---------- COSTUME ----------
    @Override
    public CostumeResponseDto addCostume(CostumeRequestDto dto) {
        Costume entity = costumeMapper.toEntity(dto);
        return costumeMapper.toResponseDto(costumeRepository.save(entity));
    }

    @Override
    public List<CostumeResponseDto> getAllCostumes() {
        return costumeRepository.findAll()
                .stream().map(costumeMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    // ---------- ITEM ----------
    @Override
    public CostumeItemResponseDto addItem(CostumeItemRequestDto dto) {
        CostumeItem entity = itemMapper.toEntity(dto);
        return itemMapper.toResponseDto(itemRepository.save(entity));
    }

    @Override
    public List<CostumeItemResponseDto> getAllItems() {
        return itemRepository.findAll()
                .stream().map(itemMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    // ---------- IMAGE ----------
    @Override
    public CostumeImageResponseDto addImage(CostumeImageRequestDto dto) {
        CostumeImage entity = imageMapper.toEntity(dto);
        return imageMapper.toResponseDto(imageRepository.save(entity));
    }

    @Override
    public List<CostumeImageResponseDto> getAllImages() {
        return imageRepository.findAll()
                .stream().map(imageMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ItemResponseDto addFullCostume(ItemRequestDto requestDto) {

        // ---------- 1️⃣ Save Category ----------
        CostumeCategory category = categoryMapper.toEntity(requestDto.getCategory());
        category = categoryRepository.save(category);

        // ---------- 2️⃣ Save Variant ----------
        CostumeVariant variant = variantMapper.toEntity(requestDto.getVariant());
        variant.setCategory(category);
        variant = variantRepository.save(variant);

        // ---------- 3️⃣ Save Costume ----------
        Costume costume = costumeMapper.toEntity(requestDto.getCostume());
        costume.setCostumeVariant(variant);
        costume = costumeRepository.save(costume);

        // ---------- 4️⃣ Save Items ----------
        if (requestDto.getItems() != null) {
            for (CostumeItemRequestDto itemDto : requestDto.getItems()) {
                CostumeItem item = itemMapper.toEntity(itemDto);
                item.setCostume(costume);
                itemRepository.save(item);
            }
        }

        // ---------- 5️⃣ Save Images ----------
        if (requestDto.getImages() != null) {
            for (CostumeImageRequestDto imgDto : requestDto.getImages()) {
                CostumeImage img = imageMapper.toEntity(imgDto);
                img.setCostumeVariant(variant);
                imageRepository.save(img);
            }
        }

        // ---------- 6️⃣ Return full response ----------
        return fullMapper.toItemDto(costume);
    }

    @Override
    public List<ItemResponseDto> parseExcel(MultipartFile file) throws Exception {
        List<ItemResponseDto> result = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            if (sheet.getPhysicalNumberOfRows() <= 1) {
                throw new IllegalArgumentException("Excel file is empty or missing data.");
            }

            // Read header row
            Row headerRow = sheet.getRow(0);
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(cell.getStringCellValue().trim());
            }

            // Iterate over data rows
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Map<String, String> rowMap = new HashMap<>();
                for (int j = 0; j < headers.size(); j++) {
                    Cell cell = row.getCell(j);
                    String value = getCellValue(cell);
                    rowMap.put(headers.get(j), value);
                }

                ItemResponseDto dto = mapToItemResponseDto(rowMap);
                result.add(dto);
            }
        }

        // Save all parsed data
        return saveParsedData(result);
    }

    @Override
    public ItemResponseDto updateFullCostume(Long costumeId, ItemRequestDto requestDto) {

        // 1️⃣ Find existing costume
        Costume costume = costumeRepository.findById(costumeId)
                .orElseThrow(() -> new RuntimeException("Costume not found with ID: " + costumeId));

        // 2️⃣ Update Variant (partial update - only update fields that are provided)
        CostumeVariant variant = costume.getCostumeVariant();
        if (variant == null) throw new RuntimeException("Variant not found for costume ID: " + costumeId);

        if (requestDto.getVariant() != null) {
            CostumeVariantRequestDto variantDto = requestDto.getVariant();
            
            if (variantDto.getCategoryId() != null) {
                CostumeCategory category = categoryRepository.findById(variantDto.getCategoryId())
                        .orElseThrow(() -> new RuntimeException("Category not found with ID: " + variantDto.getCategoryId()));
                variant.setCategory(category);
            }
            if (variantDto.getVariantDescription() != null) {
                variant.setVariantDescription(variantDto.getVariantDescription());
            }
            if (variantDto.getStyle() != null) {
                variant.setStyle(variantDto.getStyle());
            }
            if (variantDto.getPrimaryColor() != null) {
                variant.setPrimaryColor(variantDto.getPrimaryColor());
            }
            if (variantDto.getSecondaryColor() != null) {
                variant.setSecondaryColor(variantDto.getSecondaryColor());
            }
            if (variantDto.getTertiaryColor() != null) {
                variant.setTertiaryColor(variantDto.getTertiaryColor());
            }
            variantRepository.save(variant);
        }

        // 3️⃣ Update Category (partial update - only update fields that are provided)
        CostumeCategory category = variant.getCategory();
        if (category != null && requestDto.getCategory() != null) {
            CostumeCategoryRequestDto categoryDto = requestDto.getCategory();
            
            if (categoryDto.getCategoryName() != null) {
                category.setCategoryName(categoryDto.getCategoryName());
            }
            if (categoryDto.getCategoryDescription() != null) {
                category.setCategoryDescription(categoryDto.getCategoryDescription());
            }
            categoryRepository.save(category);
        }

        // 4️⃣ Update Costume main details (partial update - only update fields that are provided)
        if (requestDto.getCostume() != null) {
            CostumeRequestDto costumeDto = requestDto.getCostume();
            
            if (costumeDto.getCostumeVariantId() != null) {
                CostumeVariant newVariant = variantRepository.findById(costumeDto.getCostumeVariantId())
                        .orElseThrow(() -> new RuntimeException("Variant not found with ID: " + costumeDto.getCostumeVariantId()));
                costume.setCostumeVariant(newVariant);
            }
            if (costumeDto.getNumberOfItems() != null) {
                costume.setNumberOfItems(costumeDto.getNumberOfItems());
            }
            if (costumeDto.getSize() != null) {
                costume.setSize(costumeDto.getSize());
            }
            if (costumeDto.getSerialNumber() != null) {
                costume.setSerialNumber(costumeDto.getSerialNumber());
            }
            if (costumeDto.getPurchasePrice() != null) {
                costume.setPurchasePrice(costumeDto.getPurchasePrice());
            }
            if (costumeDto.getRentalPricePerDay() != null) {
                costume.setRentalPricePerDay(costumeDto.getRentalPricePerDay());
            }
            if (costumeDto.getDeposit() != null) {
                costume.setDeposit(costumeDto.getDeposit());
            }
            if (costumeDto.getIsRentable() != null) {
                costume.setIsRentable(costumeDto.getIsRentable());
            }
            costumeRepository.save(costume);
        }

        // 5️⃣ Update Items (only if provided - replace all items if list is provided)
        if (requestDto.getItems() != null) {
            // Delete old items
            itemRepository.deleteAll(itemRepository.findAllByCostumeId(costumeId));
            
            // Add new items
            for (CostumeItemRequestDto itemDto : requestDto.getItems()) {
                CostumeItem item = itemMapper.toEntity(itemDto);
                item.setCostume(costume);
                itemRepository.save(item);
            }
        }

        // 6️⃣ Update Images (only if provided - replace all images if list is provided)
        if (requestDto.getImages() != null) {
            // Delete old images
            imageRepository.deleteAll(imageRepository.findAllByCostumeVariantId(variant.getId()));
            
            // Add new images
            for (CostumeImageRequestDto imgDto : requestDto.getImages()) {
                CostumeImage img = imageMapper.toEntity(imgDto);
                img.setCostumeVariant(variant);
                imageRepository.save(img);
            }
        }

        // 7️⃣ Return updated full DTO
        return fullMapper.toItemDto(costume);
    }

    @Override
    public Integer getNextSerialNumber(String categoryName, String primaryColor, String secondaryColor, String tertiaryColor, String size) {
        String sec = secondaryColor == null ? "" : secondaryColor;
        String ter = tertiaryColor == null ? "" : tertiaryColor;
        Integer max = costumeRepository.findMaxSerialNumber(categoryName, primaryColor, sec, ter, size);
        if (max == null || max <= 0) {
            return 1;
        }
        return max + 1;
    }

    /**
     * Save parsed Excel data into DB
     */
    private List<ItemResponseDto> saveParsedData(List<ItemResponseDto> parsedList) {
        List<ItemResponseDto> savedDtos = new ArrayList<>();

        for (ItemResponseDto dto : parsedList) {

            // 1️⃣ Save Category (check if exists by name)
            CostumeCategory category = categoryRepository
                    .findByCategoryName(dto.getCategoryName())
                    .orElseGet(() -> {
                        CostumeCategory c = CostumeCategory.builder()
                                .categoryName(dto.getCategoryName())
                                .categoryDescription(dto.getCategoryDescription())
                                .build();
                        return categoryRepository.save(c);
                    });

            // 2️⃣ Save Variant
            CostumeVariant variant = CostumeVariant.builder()
                    .category(category)
                    .variantDescription(dto.getVariantDescription())
                    .style(dto.getStyle())
                    .primaryColor(dto.getPrimaryColor())
                    .secondaryColor(dto.getSecondaryColor())
                    .tertiaryColor(dto.getTertiaryColor())
                    .build();
            variant = variantRepository.save(variant);

            // 3️⃣ Save Costume
            Costume costume = Costume.builder()
                    .costumeVariant(variant)
                    .numberOfItems(dto.getNumberOfItems())
                    .size(dto.getSize())
                    .purchasePrice(dto.getPurchasePrice())
                    .rentalPricePerDay(dto.getRentalPricePerDay())
                    .deposit(dto.getDeposit())
                    .isRentable(true)
                    .build();
            costume = costumeRepository.save(costume);

            final Costume savedCostume = costume;

            // 4️⃣ Save Costume Items
            List<CostumeItem> savedItems = new ArrayList<>();
            dto.getItems().forEach(itemDto -> {
                CostumeItem item = CostumeItem.builder()
                        .costume(savedCostume)
                        .itemName(itemDto.getItemName())
                        .rentalPricePerDay(itemDto.getRentalPricePerDay())
                        .deposit(itemDto.getDeposit())
                        .imageUrl(itemDto.getImageUrl())
                        .build();
                savedItems.add(itemRepository.save(item));
            });

            // 5️⃣ Save Costume Images ✅ (use existing variant, no duplication)
            final CostumeVariant savedVariant = variant;
            List<CostumeImage> savedImages = new ArrayList<>();
            dto.getImages().forEach(imgDto -> {
                CostumeImage img = CostumeImage.builder()
                        .costumeVariant(savedVariant)
                        .imageUrl(imgDto.getImageUrl())
                        .build();
                savedImages.add(imageRepository.save(img));
            });

            // 6️⃣ Update DTO with generated IDs
            dto.setCategoryId(category.getId());
            dto.setVariantId(variant.getId());
            dto.setCostumeId(costume.getId());
            dto.setIsRentable(costume.getIsRentable());

            // Update items and images back to DTO
            for (int i = 0; i < savedItems.size(); i++) {
                dto.getItems().get(i).setId(savedItems.get(i).getId());
            }
            for (int i = 0; i < savedImages.size(); i++) {
                dto.getImages().get(i).setId(savedImages.get(i).getId());
            }

            savedDtos.add(dto);
        }

        return savedDtos;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    double value = cell.getNumericCellValue();
                    return BigDecimal.valueOf(value).stripTrailingZeros().toPlainString();
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    private Integer parseInt(String val) {
        try {
            return val == null || val.isBlank() ? null : Integer.parseInt(val);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private BigDecimal parseBigDecimal(String val) {
        try {
            return val == null || val.isBlank() ? null : new BigDecimal(val);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private ItemResponseDto mapToItemResponseDto(Map<String, String> map) {
        ItemResponseDto dto = new ItemResponseDto();

        // 🪶 Category
        dto.setCategoryName(map.get("CategoryName"));
        dto.setCategoryDescription(map.get("Description"));

        // 👗 Variant
        dto.setVariantDescription(map.get("Style"));
        dto.setStyle(map.get("Style"));
        dto.setPrimaryColor(map.get("PrimaryColor"));
        dto.setSecondaryColor(map.get("SecondaryColor"));
        dto.setTertiaryColor(map.get("TertiaryColor"));

        // 👘 Costume
        dto.setNumberOfItems(parseInt(map.get("NumberOfItems")));
        dto.setSize(map.get("Size"));
        dto.setPurchasePrice(parseBigDecimal(map.get("PurchasePrice")));
        dto.setRentalPricePerDay(parseBigDecimal(map.get("RentalPricePerDay")));
        dto.setDeposit(parseBigDecimal(map.get("Deposit")));

        // 🪡 Costume Items — dynamic columns like ItemName_1, RentalPricePerDay_1, Deposit_1
        List<ItemResponseDto.CostumeItemDetail> items = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            String nameKey = "ItemName_" + i;
            if (!map.containsKey(nameKey) || map.get(nameKey).isBlank()) break;

            ItemResponseDto.CostumeItemDetail item = new ItemResponseDto.CostumeItemDetail();
            item.setItemName(map.get(nameKey));
            item.setRentalPricePerDay(parseBigDecimal(map.get("RentalPricePerDay_" + i)));
            item.setDeposit(parseBigDecimal(map.get("Deposit_" + i)));
            items.add(item);
        }
        dto.setItems(items);

        // 🖼️ Costume Images — dynamic columns like ImageURL1, ImageURL2, ...
        List<ItemResponseDto.CostumeImageDetail> images = new ArrayList<>();
        for (int i = 1; i <= 10; i++) {
            String key = "ImageURL" + i;
            if (!map.containsKey(key) || map.get(key).isBlank()) break;
            ItemResponseDto.CostumeImageDetail img = new ItemResponseDto.CostumeImageDetail();
            img.setImageUrl(map.get(key));
            images.add(img);
        }
        dto.setImages(images);

        return dto;
    }

    @Override
    public List<ItemResponseDto> getAllCostumeDetails() {

        List<CostumeCategory> categories = categoryRepository.findAll();
        List<CostumeVariant> variants = variantRepository.findAll();
        List<Costume> costumes = costumeRepository.findAll();
        List<CostumeItem> items = itemRepository.findAll();
        List<CostumeImage> images = imageRepository.findAll();

        return costumes.stream().map(costume -> {
            ItemResponseDto dto = new ItemResponseDto();

            // 👗 Variant
            CostumeVariant variant = variants.stream()
                    .filter(v -> v.getId()==(costume.getCostumeVariant().getId()))
                    .findFirst().orElse(null);

            // 🪶 Category
            CostumeCategory category = (variant != null)
                    ? categories.stream()
                    .filter(c -> c.getId()== (variant.getCategory().getId()))
                    .findFirst().orElse(null)
                    : null;

            // 🎭 Category Info
            if (category != null) {
                dto.setCategoryId(category.getId());
                dto.setCategoryName(category.getCategoryName());
                dto.setCategoryDescription(category.getCategoryDescription());
            }

            // 👗 Variant Info
            if (variant != null) {
                dto.setVariantId(variant.getId());
                dto.setVariantDescription(variant.getVariantDescription());
                dto.setStyle(variant.getStyle());
                dto.setPrimaryColor(variant.getPrimaryColor());
                dto.setSecondaryColor(variant.getSecondaryColor());
                dto.setTertiaryColor(variant.getTertiaryColor());
            }

            // 👘 Costume Info
            dto.setCostumeId(costume.getId());
            dto.setNumberOfItems(costume.getNumberOfItems());
            dto.setSize(costume.getSize());
            dto.setSerialNumber(costume.getSerialNumber());
            dto.setPurchasePrice(costume.getPurchasePrice());
            dto.setRentalPricePerDay(costume.getRentalPricePerDay());
            dto.setDeposit(costume.getDeposit());
            dto.setIsRentable(costume.getIsRentable());

            // 🪡 Costume Items (linked via costume ID)
            List<ItemResponseDto.CostumeItemDetail> itemDetails = items.stream()
                    .filter(i -> i.getCostume() != null && i.getCostume().getId()==(costume.getId()))
                    .map(i -> {
                        ItemResponseDto.CostumeItemDetail detail = new ItemResponseDto.CostumeItemDetail();
                        detail.setId(i.getId());
                        detail.setItemName(i.getItemName());
                        detail.setRentalPricePerDay(i.getRentalPricePerDay());
                        detail.setDeposit(i.getDeposit());
                        detail.setImageUrl(i.getImageUrl());
                        return detail;
                    })
                    .toList();
            dto.setItems(itemDetails);

            // 🖼️ Costume Images (linked via variant ID)
            List<ItemResponseDto.CostumeImageDetail> imageDetails = images.stream()
                    .filter(img -> img.getCostumeVariant() != null
                            && variant != null
                            && img.getCostumeVariant().getId()==(variant.getId()))
                    .map(img -> {
                        ItemResponseDto.CostumeImageDetail detail = new ItemResponseDto.CostumeImageDetail();
                        detail.setId(img.getId());
                        detail.setImageUrl(img.getImageUrl());
                        return detail;
                    })
                    .toList();
            dto.setImages(imageDetails);

            return dto;
        }).toList();
    }

    // ========== UPDATE METHODS FOR SINGLE TABLES ==========

    // ---------- CATEGORY UPDATE ----------
    @Override
    public CostumeCategoryResponseDto updateCategory(Long id, CostumeCategoryRequestDto dto) {
        CostumeCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
        
        if (dto.getCategoryName() != null) {
            category.setCategoryName(dto.getCategoryName());
        }
        if (dto.getCategoryDescription() != null) {
            category.setCategoryDescription(dto.getCategoryDescription());
        }
        
        return categoryMapper.toResponseDto(categoryRepository.save(category));
    }

    @Override
    public List<CostumeCategoryResponseDto> updateAllCategories(Map<Long, CostumeCategoryRequestDto> updates) {
        return updates.entrySet().stream()
                .map(entry -> updateCategory(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // ---------- VARIANT UPDATE ----------
    @Override
    public CostumeVariantResponseDto updateVariant(Long id, CostumeVariantRequestDto dto) {
        CostumeVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found with ID: " + id));
        
        if (dto.getCategoryId() != null) {
            CostumeCategory category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found with ID: " + dto.getCategoryId()));
            variant.setCategory(category);
        }
        if (dto.getVariantDescription() != null) {
            variant.setVariantDescription(dto.getVariantDescription());
        }
        if (dto.getStyle() != null) {
            variant.setStyle(dto.getStyle());
        }
        if (dto.getPrimaryColor() != null) {
            variant.setPrimaryColor(dto.getPrimaryColor());
        }
        if (dto.getSecondaryColor() != null) {
            variant.setSecondaryColor(dto.getSecondaryColor());
        }
        if (dto.getTertiaryColor() != null) {
            variant.setTertiaryColor(dto.getTertiaryColor());
        }
        
        return variantMapper.toResponseDto(variantRepository.save(variant));
    }

    @Override
    public List<CostumeVariantResponseDto> updateAllVariants(Map<Long, CostumeVariantRequestDto> updates) {
        return updates.entrySet().stream()
                .map(entry -> updateVariant(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // ---------- COSTUME UPDATE ----------
    @Override
    public CostumeResponseDto updateCostume(Long id, CostumeRequestDto dto) {
        Costume costume = costumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Costume not found with ID: " + id));
        
        if (dto.getCostumeVariantId() != null) {
            CostumeVariant variant = variantRepository.findById(dto.getCostumeVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found with ID: " + dto.getCostumeVariantId()));
            costume.setCostumeVariant(variant);
        }
        if (dto.getNumberOfItems() != null) {
            costume.setNumberOfItems(dto.getNumberOfItems());
        }
        if (dto.getSize() != null) {
            costume.setSize(dto.getSize());
        }
        if (dto.getSerialNumber() != null) {
            costume.setSerialNumber(dto.getSerialNumber());
        }
        if (dto.getPurchasePrice() != null) {
            costume.setPurchasePrice(dto.getPurchasePrice());
        }
        if (dto.getRentalPricePerDay() != null) {
            costume.setRentalPricePerDay(dto.getRentalPricePerDay());
        }
        if (dto.getDeposit() != null) {
            costume.setDeposit(dto.getDeposit());
        }
        if (dto.getIsRentable() != null) {
            costume.setIsRentable(dto.getIsRentable());
        }
        
        return costumeMapper.toResponseDto(costumeRepository.save(costume));
    }

    @Override
    public List<CostumeResponseDto> updateAllCostumes(Map<Long, CostumeRequestDto> updates) {
        return updates.entrySet().stream()
                .map(entry -> updateCostume(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // ---------- ITEM UPDATE ----------
    @Override
    public CostumeItemResponseDto updateItem(Long id, CostumeItemRequestDto dto) {
        CostumeItem item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));
        
        if (dto.getCostumeId() != null) {
            Costume costume = costumeRepository.findById(dto.getCostumeId())
                    .orElseThrow(() -> new RuntimeException("Costume not found with ID: " + dto.getCostumeId()));
            item.setCostume(costume);
        }
        if (dto.getItemName() != null) {
            item.setItemName(dto.getItemName());
        }
        if (dto.getRentalPricePerDay() != null) {
            item.setRentalPricePerDay(dto.getRentalPricePerDay());
        }
        if (dto.getDeposit() != null) {
            item.setDeposit(dto.getDeposit());
        }
        if (dto.getImageUrl() != null) {
            item.setImageUrl(dto.getImageUrl());
        }
        
        return itemMapper.toResponseDto(itemRepository.save(item));
    }

    @Override
    public List<CostumeItemResponseDto> updateAllItems(Map<Long, CostumeItemRequestDto> updates) {
        return updates.entrySet().stream()
                .map(entry -> updateItem(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // ---------- IMAGE UPDATE ----------
    @Override
    public CostumeImageResponseDto updateImage(Long id, CostumeImageRequestDto dto) {
        CostumeImage image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found with ID: " + id));
        
        if (dto.getCostumeVariantId() != null) {
            CostumeVariant variant = variantRepository.findById(dto.getCostumeVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found with ID: " + dto.getCostumeVariantId()));
            image.setCostumeVariant(variant);
        }
        if (dto.getImageUrl() != null) {
            image.setImageUrl(dto.getImageUrl());
        }
        
        return imageMapper.toResponseDto(imageRepository.save(image));
    }

    @Override
    public List<CostumeImageResponseDto> updateAllImages(Map<Long, CostumeImageRequestDto> updates) {
        return updates.entrySet().stream()
                .map(entry -> updateImage(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    // ========== DELETE METHODS FOR SINGLE TABLES ==========

    // ---------- CATEGORY DELETE ----------
    @Override
    public void deleteCategory(Long id) {
        CostumeCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
        categoryRepository.delete(category);
    }

    @Override
    public void deleteAllCategories() {
        categoryRepository.deleteAll();
    }

    // ---------- VARIANT DELETE ----------
    @Override
    public void deleteVariant(Long id) {
        CostumeVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found with ID: " + id));
        variantRepository.delete(variant);
    }

    @Override
    public void deleteAllVariants() {
        variantRepository.deleteAll();
    }

    // ---------- COSTUME DELETE ----------
    @Override
    public void deleteCostume(Long id) {
        // Use the existing cascading delete implementation
        Costume costume = costumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Costume not found with ID: " + id));

        CostumeVariant variant = costume.getCostumeVariant();

        // Delete all dependent data
        itemRepository.deleteAll(itemRepository.findAllByCostumeId(id));

        if (variant != null) {
            imageRepository.deleteAll(imageRepository.findAllByCostumeVariantId(variant.getId()));
            CostumeCategory category = variant.getCategory();

            costumeRepository.delete(costume);
            variantRepository.delete(variant);

            if (category != null) {
                categoryRepository.delete(category);
            }
        } else {
            costumeRepository.delete(costume);
        }
    }

    @Override
    public void deleteAllCostumes() {
        costumeRepository.deleteAll();
    }

    // ---------- ITEM DELETE ----------
    @Override
    public void deleteItem(Long id) {
        CostumeItem item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));
        itemRepository.delete(item);
    }

    @Override
    public void deleteAllItems() {
        itemRepository.deleteAll();
    }

    // ---------- IMAGE DELETE ----------
    @Override
    public void deleteImage(Long id) {
        CostumeImage image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found with ID: " + id));
        imageRepository.delete(image);
    }

    @Override
    public void deleteAllImages() {
        imageRepository.deleteAll();
    }

}