package com.fishing.backend.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fishing.backend.domain.FishingProduct;
import com.fishing.backend.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
	private final ProductService productService;

	@GetMapping
	public List<FishingProduct> list() {
		return productService.listActiveProducts();
	}

	@GetMapping("/{id}")
	public FishingProduct get(@PathVariable Long id) {
		return productService.getProduct(id);
	}
}

