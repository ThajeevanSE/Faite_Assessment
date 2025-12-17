package com.faite_assessment.backend.Dtos;

import com.faite_assessment.backend.Models.Category;
import com.faite_assessment.backend.Models.ProductCondition;
import com.faite_assessment.backend.Models.SaleStatus;
import lombok.Data;

@Data
public class ProductRequestDTO {
    private String title;
    private String description;
    private Double price;
    private Category category;
    private ProductCondition condition;
    private SaleStatus saleStatus;
    private String imageUrl;
}