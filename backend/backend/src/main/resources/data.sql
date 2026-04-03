DELETE FROM reservation;
DELETE FROM fishing_product;
DELETE FROM fishing_spot;

INSERT INTO fishing_spot (id, name, address, description)
VALUES
  (1, '강변 낚시터', '서울 어딘가 123', '가족/초보 환영'),
  (2, '바다 선상낚시', '인천 항구 45', '선상 출조 상품');

INSERT INTO user_account (email, password_hash, name, phone, role)
VALUES
  ('user1@example.com', '{noop}dev', '테스트유저', '010-0000-0000', 'USER'),
  ('admin@example.com', '{noop}dev', '관리자', '010-9999-9999', 'ADMIN')
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  name = VALUES(name),
  phone = VALUES(phone),
  role = VALUES(role);

INSERT INTO fishing_product (id, spot_id, name, description, base_price, max_people, active)
VALUES
  (1, 1, '반일 체험(4시간)', '장비 대여 포함', 50000, 6, TRUE),
  (2, 1, '종일 체험(8시간)', '장비 대여 포함', 80000, 6, TRUE),
  (3, 2, '선상 출조(6시간)', '미끼/채비 별도', 120000, 10, TRUE);

