package com.fishing.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fishing.backend.domain.FishingProduct;
import com.fishing.backend.mapper.FishingProductMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
	private final FishingProductMapper fishingProductMapper;

	public List<FishingProduct> listActiveProducts() {
		return fishingProductMapper.findAllActive();
	}

	public List<FishingProduct> listAllProducts() {
		return fishingProductMapper.findAll();
	}

	public FishingProduct getProduct(Long id) {
		return fishingProductMapper
			.findById(id)
			.orElseThrow(() -> new NotFoundException("product not found"));
	}

	@Transactional
	public FishingProduct createProduct(FishingProduct product) {
		fishingProductMapper.insert(product);
		return getProduct(product.getId());
	}

	@Transactional
	public FishingProduct updateProduct(FishingProduct product) {
		getProduct(product.getId());
		fishingProductMapper.update(product);
		return getProduct(product.getId());
	}

	@Transactional
	public FishingProduct setProductActive(Long id, boolean active) {
		getProduct(id);
		fishingProductMapper.setActive(id, active);
		return getProduct(id);
	}
}

