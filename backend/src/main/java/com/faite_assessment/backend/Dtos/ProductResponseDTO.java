package com.faite_assessment.backend.Dtos;

import com.faite_assessment.backend.Models.Category;
import com.faite_assessment.backend.Models.ProductCondition;
import com.faite_assessment.backend.Models.SaleStatus;
import lombok.Data;

@Data
public class ProductResponseDTO {
    public Long id;
    public String title;
    public String description;
    public Double price;
    public Category category;
    public ProductCondition condition;
    public SaleStatus saleStatus;
    public String imageUrl;
}
