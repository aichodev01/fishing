package com.fishing.backend.api.admin;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fishing.backend.api.admin.dto.UpsertProductRequest;
import com.fishing.backend.domain.FishingProduct;
import com.fishing.backend.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {
	private final ProductService productService;

	@GetMapping
	public List<FishingProduct> list() {
		return productService.listAllProducts();
	}

	@PostMapping
	public FishingProduct create(@Valid @RequestBody UpsertProductRequest req) {
		FishingProduct product = new FishingProduct();
		product.setSpotId(req.getSpotId());
		product.setName(req.getName());
		product.setDescription(req.getDescription());
		product.setBasePrice(req.getBasePrice());
		product.setMaxPeople(req.getMaxPeople());
		product.setActive(req.getActive());
		return productService.createProduct(product);
	}

	@PutMapping("/{id}")
	public FishingProduct update(@PathVariable Long id, @Valid @RequestBody UpsertProductRequest req) {
		FishingProduct product = new FishingProduct();
		product.setId(id);
		product.setSpotId(req.getSpotId());
		product.setName(req.getName());
		product.setDescription(req.getDescription());
		product.setBasePrice(req.getBasePrice());
		product.setMaxPeople(req.getMaxPeople());
		product.setActive(req.getActive());
		return productService.updateProduct(product);
	}

	@PostMapping("/{id}/active")
	public FishingProduct setActive(@PathVariable Long id, @RequestBody ActiveReq req) {
		return productService.setProductActive(id, req.active);
	}

	public record ActiveReq(boolean active) {
	}
}

