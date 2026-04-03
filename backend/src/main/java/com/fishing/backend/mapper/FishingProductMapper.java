package com.fishing.backend.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.fishing.backend.domain.FishingProduct;

@Mapper
public interface FishingProductMapper {
	List<FishingProduct> findAllActive();
	List<FishingProduct> findAll();
	Optional<FishingProduct> findById(Long id);
	int insert(FishingProduct product);
	int update(FishingProduct product);
	int setActive(@Param("id") Long id, @Param("active") boolean active);
}

