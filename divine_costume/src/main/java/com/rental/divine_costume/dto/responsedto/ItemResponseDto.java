package com.rental.divine_costume.dto.responsedto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ItemResponseDto {

    // 🪶 Costume Category Info
    private Long categoryId;
    private String categoryName;
    private String categoryDescription;

    // 👗 Costume Variant Info
    private Long variantId;
    private String variantDescription;
    private String style;
    private String primaryColor;
    private String secondaryColor;
    private String tertiaryColor;

    // 👘 Costume Info
    private Long costumeId;
    private Integer numberOfItems;
    private String size;
    private Integer serialNumber;
    private BigDecimal purchasePrice;
    private BigDecimal rentalPricePerDay;
    private BigDecimal deposit;
    private Boolean isRentable;

    // 🪡 Costume Items (List of sub-components)
    private List<CostumeItemDetail> items;

    // 🖼️ Costume Images
    private List<CostumeImageDetail> images;

    // -----------------------------
    // 🧩 Nested Inner DTO Classes
    // -----------------------------

    @Data
    public static class CostumeItemDetail {
        private Long id;
        private String itemName;
        private BigDecimal rentalPricePerDay;
        private BigDecimal deposit;
        private String imageUrl;
    }

    @Data
    public static class CostumeImageDetail {
        private Long id;
        private String imageUrl;
    }
}
