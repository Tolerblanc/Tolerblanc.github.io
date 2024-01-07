---
title: "레이트레이싱이란 무엇일까?"
excerpt: "어떻게 컴퓨터가 빛을 사실적으로 표현할 수 있는걸까?"

categories:
    - Graphics
tags:
    - [Graphics, Mathemetics, 42Seoul]
  
date: 2024-01-07
last_modified_at: 2024-01-07

toc: true
toc_sticky: true
related: true
---

<div class="notice--info" markdown="1">
👨‍💻 개인 공부 기록용 블로그 입니다. <br/>
💡 틀린 내용이나 오타는 댓글, 메일로 제보해주시면 감사하겠습니다!!  (__)
</div>

> 사진들은 [Reference](#reference)에서 가져왔습니다. 곧 직접 그린 그림으로 수정할 예정입니다.

## Introduction

레이 트레이싱(Ray Tracing)은 컴퓨터 그래픽스의 기술 중 하나로, 현실 세계에서 빛이 동작하는 방식을 시뮬레이션 하는 방법이다. 이를 통해 창문으로 들어온 빛이 물체 표면에 반사되어 그림자가 드리우는 등의 사실적인 표현을 디지털 환경에서 구현할 수 있게 된다. 그러나 이는 계산 집약적이라서, 실시간 렌더링을 위해 래스터화(Rasterisation) 라는 기술로 대체되다가, 최근에는 GPU의 발전으로 사실적인 표현을 위하여 다시금 부상하고 있는 기술이다. 이 글에서는 컴퓨터가 어떻게 빛을 묘사하는지, 빛과 도형의 상호 작용을 어떻게 컴퓨터로 표현할 수 있는지 알아본다.

## Prerequisite

- 그래픽스에서 쓰이는 기본적인 수학 개념이 필요하다.
    - 기본 선형대수: 벡터의 내적, 외적, 사칙연산, 행렬의 개념
    - 이차방정식의 근의 공식과 판별식 개념까지 필수이다.
    - [scratchapixel](https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/geometry/math-operations-on-points-and-vectors.html) 문서에 잘 설명되어 있으며, 곧 이 문단으로 옮겨와 수정할 예정이다.
    - 딥러닝 글에서 추천한 것 처럼, [3blue1brown의 선형대수 시리즈](https://youtu.be/fNk_zzaMoSs)도 강추한다.

- 오른손 좌표계를 사용할 것이다.
    - 모니터의 왼쪽 최하점에서 오른쪽 방향을 \\( +x \\)
    - 모니터의 왼쪽 최하점에서 위쪽 방향을 \\( +y \\)
    - 모니터에서 튀어나오는 방향을 \\( +z \\)

![오른손 좌표계](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/b8966f26-3322-4955-93d6-39b0eeff399e)


## Ray & Camera

### 빛을 수식으로 표현하기

- 레이 트레이싱(Ray Tracing)은 앞서 말했듯, 빛의 동작(행동)을 묘사하는 방법이다. 즉, 빛을 추적하여 그 지점(픽셀)에서 보이는 색을 결정하는 것이다.
- 3차원 상의 빛을 다음과 같이 생각해보자.

![ray vector](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/fff54b6d-f478-4fb5-9399-cee792941643)

\\[ P(t) = A + tB \\]

- \\( P \\)는 3차원 상의 빛(레이)의 위치
- \\( A \\)는 빛의 시점(출발점)
- \\( B \\)는 빛의 방향 벡터
- \\( t \\)는 실수 범위의 매개변수: 양수일 경우, 시점 기준 방향벡터가 가리키는 방향으로 빛이 이동한다. 음수일 경우 그 반대.

C 코드로 작성하면 다음과 같다.
```C
typedef struct s_ray
{
	t_point	orig;
	t_vec	dir;
}				t_ray;

t_ray	new_ray(t_point orig, t_vec dir)
{
	t_ray	result;

	result.orig = orig;
	result.dir = dir;
	return (result);
}

t_point	ray_at(t_ray ray, t_scalar s)
{
	t_point	dst;

	dst = vec_sum(ray.orig, vec_mul(ray.dir, s));
	return (dst);
}

```

즉, 시점과 방향벡터를 알면 하나의 빛(레이) 벡터를 만들 수 있으며, 매개변수인 \\( t \\) 값 (코드에서`ray_at`함수의 `t_scalar s`로 표현됨) 만 결정되면 빛의 도착점을 알 수 있다.
\\( t \\) 값을 조절하여 빛을 이동시켜가며 추적한다고 이해하자.

### 카메라 기하 (Camera Geometry)

현실 세계에서는 빛이 우리 눈에 들어오지만, 레이 트레이싱에서는 카메라에서 빛을 쏘아 픽셀의 색을 결정하게 된다. 우선, 원점에 고정된 카메라와 작은 크기의 고정 뷰포트(Viewport)가 있다고 가정해보자. 

![viewport](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/f3f46210-99ac-4445-b861-50a40b2de61e)

\\( +z\\) 방향에는 우리의 진짜 눈이 있을 것이고, 원점에 카메라가 있으며 검은색 사각형(Viewport)에 카메라가 보는 것이 담긴다고 생각하면 된다. 빨간색 화살표가 앞서 살펴봤던 빛(레이)이다. 정확한 비유는 아니지만, 안경을 쓴다고 생각해보자. 우리의 눈이 곧 카메라가 되고, 안경 뒤에 있는 상이 안경에 맺힌다. 우리 눈(카메라)은 안경을 보고 장면을 인식하게 된다. 

고정된 크기의 뷰포트를 두게 되면, 계산량을 줄일 수 있다. 본래는 각 광원마다 모든 방향으로 빛을 쏴서 카메라에 튕겨 들어오는 빛의 색을 모두 계산해야 하지만, 뷰포트를 둠으로써 카메라에서 빛을 쏘아 정해진 크기의 사각형만 채우면 되기 때문이다. 아래 움짤을 보면 느낌이 올 것이다.

![camera viewport](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/124c2f40-80cd-42e4-959c-52a75fcaf472)

계산의 편의를 위해, 일단 카메라와 뷰포트 간 거리 (__focal_length__)를 1로 고정하고, 뷰포트의 세로 길이를 2로 고정한다. 뷰포트의 가로 길이는 종횡비가 결정한다.

카메라 원점으로부터 출발하는 빛(레이)를 `primary_ray`라고 하자. (반사가 한 번도 되지 않았다는 뜻이다.) 아래의 `get_primary_ray` 함수는 카메라가 쏘는 각 빛의 벡터를 얻을 수 있는 함수이다.

```C
t_ray	get_primary_ray(t_camera cam, t_scalar w, t_scalar h)
{
	t_ray	result;
	t_vec	direction;

	result.orig = cam.viewpoint;
	direction = vec_sum(cam.vp.left_bot, vec_mul(cam.vp.horizontal, w));
	direction = vec_sum(direction, vec_mul(cam.vp.vertical, h));
	direction = vec_sub(direction, cam.viewpoint);
	result.dir = vec_normalize(direction);
	return (result);
} 
//w, h는 각각 width, height에 해당하는 가중치 이다.
```
`cam.vp`는 뷰포트, `cam.viewpoint`는 카메라의 좌표 (현재는 원점으로 고정) 이다. 방향벡터를 결정하기 위해서, (뷰포트의 왼쪽 아래 꼭짓점 + width + height - 카메라 좌표)를 계산 후 정규화한다.

## Ray-Sphere Intersection

기본적인 카메라와 빛(레이) 구현이 되었으니, 이제 물체를 구현할 것이다. 구를 구현하고, 빛과의 충돌 처리를 통해 픽셀의 색깔을 결정해보자. 이차방정식 계산이 필요하다.

- 구의 중점 \\( C_x, C_y, C_z \\) 를 가지는 구의 방정식은 다음과 같다.

\\[ (x-C_x)^2 + (y-C_y)^2 + (z-C_z)^2 = r^2 \\]

- 하지만 우리는 벡터를 통해 계산할 것이므로 구 경계의 한 점 \\(P=(x, y, z) \\) 를 생각하면, \\( P \\)로 부터 구의 중점으로 가는 벡터의 크기는 반지름과 같을 것이다. 이를 수식으로 표현하면 다음과 같다.

\\[ ||\vec{CP}|| =||P-C|| = r^2 \\]

- 좀 더 확장하여 \\( P \\) 를 레이의 도착지점으로 보면, \\( P(t) = A + tB \\) 로 치환할 수 있다.
    
\\[ |A + tB - C||A + tB - C| = r^2 \\]
    
\\[ A\cdot A + tA\cdot B - A \cdot C + tA\cdot B + t^2 B \cdot B - tB\cdot C - A\cdot C -tB\cdot C + C \cdot C = r^2 \\]

- \\( t \\) 에 대한 이차식으로 정리하면 다음과 같은 이차방정식을 얻을 수 있다.

\\[ B \cdot B t^2 - 2 * t B\cdot (A-C) + (A-C)\cdot (A-C) - r^2 = 0 \\]

- 판별식을 사용하여 2개의 실근을 가질 때를 조사하면, 레이와 구가 충돌하는 지점을 구할 수 있다.

\\[ D_{iscriminant} = 4 * ||B \cdot (A - C)|| - 4 * B \cdot B * (A-C)\cdot (A-C) > 0 \\]

위 과정을 C 코드로 옮기면 아래와 같은 함수로 구현할 수 있다.

```C
int	check_sphere_hit(t_ray ray, t_sphere *sp)
{
	t_vec	  ray2center;
	double	a;
	double	b;
	double	c;
	double	discriminant;

	ray2center = vec_sub(ray.orig, sp->center);
	a = vec_dot(ray.dir, ray.dir);
	b = 2.0 * vec_dot(ray2center, ray.dir);
	c = vec_dot(ray2center, ray2center) - sp->rsquare;
	discriminant = b * b - 4 * a * c;
	if (discriminant > 0)
		return (color_to_int(sp->color));
	return (-1);
}
```

- 판별식이 양수라면, 두 근 중 작은 근을 `primary ray`가 충돌하는 가장 가까운 지점으로 생각할 수 있다. -> 더 작은 근을 `less real root`라고 칭한다.
- 아래와 같이 `lrr: less real root` 값을 레이의 \\( t \\) 값으로 보고, 구 표면에서 나가는 방향의 법선벡터를 구할 수 있다.
- 법선벡터를 통해 물체와 충돌한 빛이 어느 방향으로 진행하는지 알 수 있다.

\\( \vec{P} - \vec{C} = \vec{N} \\) 단, \\( \vec{N} \\) 은 법선벡터이며, 아래에선 정규화를 통해 정규법선벡터를 구한다.

```C
int	get_sphere_color(t_ray ray, t_sphere *sp, double lrr)
{
	t_vec	normal;

	normal = ray_at(ray, lrr);
	normal = vec_sub(normal, sp->center);
	normal = vec_normalize(normal);
	normal.x += 1;
	normal.y += 1;
	normal.z += 1;
	normal = vec_mul(normal, 255 * 0.5);
	return (color_to_int(new_color(normal.x, normal.y, normal.z)));
}
```

## Hit Record

카메라도 있고, 빛도 있고, 물체도 있다. 하지만 물체가 여러 개일 경우 고려할 점이 많아진다. 어떤 물체가 더 앞에 있는지, (뒤에 있는 물체는 아예 고려하지 않아도 된다.) 어떤 물체가 카메라보다 뒤에 있는지 (이 또한 렌더 대상이 아니기 때문에 고려하지 않아도 된다.) 에 대한 정보를 체크해야 한다. 따라서 아래와 같은 구조체를 사용하여, 충돌 시점의 정보를 저장할 것이다.

```C
struct s_hit_record
{
    t_point3    p;
    t_vec3      normal;
    double      tmin;
    double      tmax;
    double      t;
    t_bool      front_face;
};
```

- `p`는 레이와 물체가 충돌했을 때의 교점의 좌표이다.
- `normal`은 교점에서의 법선벡터이다.
- `t`는 레이의 출발점과 교점 사이의 거리이다.
  - \\( P(t) = A + tB \\) 에서의 \\( t \\) 와 일맥상통한다.
- `tmin, tmax`는 각각 `t`의 최소, 최댓값이다.
- `front_face`는 법선벡터가 광원 반대방향인지 확인하는 변수이다.

레이의 방향벡터와 물체 충돌 후 법선벡터의 내적이 음수라면, 사이각 \\( \theta \\)가 둔각이라서 각 벡터가 바라보는 방향이 반대가 된다. 아래 사진을 보자.

![front face](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/c91cbac4-06cc-4843-a95c-40ebd9d85387)

실제로 구해야 하는 것은 __Outside Normal__ 인데, 법선 벡터를 구하다 보면 __Local Normal__ 과 같이 벡터의 방향이 반대가 되는 경우가 있다. 이를 보정하기 위하여 아래와 같은 함수로 `front_face`를 체크한다.

```C
void	set_face_normal(t_ray ray, t_hit_record *rec)
{
	if (vec_dot(ray.dir, rec->normal) < 0)
		rec->front_face = 1;
	else
		rec->front_face = 0;
	if (!rec->front_face)
		rec->normal = vec_mul(rec->normal, -1);
}
```

앞서 구현했던 `check_sphere_hit` 함수를 개선해보자. 우선, 판별식을 짝수 공식으로 변경할 수 있다. 또한 `t_hit_record` 구조체를 도입했기 때문에 값을 채워 넣어줘야 한다. 값을 채우는 과정에서, 두 근이 `[tmin, tmax]` 범위를 넘어가는지 체크해주었다. 근이 범위 밖에 존재하는 경우, 아예 충돌하지 않는 것으로 체크한다. 

```C
int	check_sphere_hit(t_ray ray, t_sphere *sp, t_hit_record *rec)
{
	t_vec	ray2center;
	double	half_b;
	double	discriminant;
	double	root;

	ray2center = vec_sub(ray.orig, sp->center);
	half_b = vec_dot(ray2center, ray.dir);
	discriminant = half_b * half_b - (vec_dot(ray.dir, ray.dir) \
					* (vec_dot(ray2center, ray2center) - sp->rsquare));
	if (discriminant <= 0)
		return (-1);
	root = (-half_b - sqrt(discriminant)) / vec_dot(ray.dir, ray.dir);
	if (root < rec->tmin || root > rec->tmax)
	{
		root = (-half_b + sqrt(discriminant)) / vec_dot(ray.dir, ray.dir);
		if (root < rec->tmin || root > rec->tmax)
			return (-1);
	}
	rec->dist = root;
	rec->p = ray_at(ray, root);
	rec->normal = vec_mul(vec_sub(rec->p, sp->center), 1 / sp->radius);
	set_face_normal(ray, rec);
	return (get_sphere_color(rec->normal));
}
```

## Phong Lighting Model

빛과 물체의 충돌을 결정할 때, 여러 물체를 고려할 수 있게 되었다. 이제 현실세계처럼 여러 종류의 빛을 모아서 색 표현을 해보자. 

빛을 현실적으로 고려하기 위해서 3차원 공간에 **광원**을 놓고, 광원으로부터 나온 빛이 **물체에 미치는 영향**을 계산하자. 실제로는 광원과 오브젝트 사이 거리가 영향을 미치고, 물체의 표면이 어떤 재질인지, 정반사를 하는지, 난반사를 하는지, 다른 물체에서 반사되어 들어온 빛, 대기 중 입자에 의해 산란되어 들어온 빛, 투명한 물체에서 굴절되어 들어온 빛 등 많은 요소가 영향을 미칠 것이다. 이렇게 우리 눈 또는 카메라에 들어온 모든 빛을 고려하는 렌더링 기법이 `Ray Tracing`이다.

물체의 색상은 반사율을 통해 표현할 것이다. 실제로, 백색광을 (1, 1, 1) 이라고 가정하면, 물체의 반사율 (0.7, 0, 0) 만큼 반사하여 우리 눈에는 빨간색 비슷한 색깔로 보인다. (즉, 반사율을 통해 색상 자체를 벡터로 생각할 수 있다.)

이 모든 요소를 고려하려면 컴퓨팅 성능이 매우 많이 필요하고, 구현하기도 힘들다. 따라서 간단한 물리 법칙에 기반한 `Phong Lighting Model`을 사용할 것이다.

아래와 같이 _Ambient Lighting_, _Diffuse Lighing_, _Specular Lighting_을 모두 합산한 것이 **Phong Lighting Model** 이다.

![phong](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/031d7184-cb60-4092-b5de-7188097f9d2f)

- Ambient Lighting : 주변 조명, 밝은 낮 어두운 그늘에 들어가도 물체가 보이는 것처럼, 공기 중 산란되어 존재하는 빛으로 인해 물체가 밝아지는 것을 묘사
- Diffuse Lighting : 난반사 역할, 광선이 물체에 비스듬하게 들어올 수록 단위 면적 당 들어오는 광선 수가 적다는 논리를 적용함
- Specular Lighting : 정반사 역할, 물체의 반짝이는 하이라이팅을 표현
- 실제 퐁 조명 모델은 방사광(Emission)도 존재하지만 생략함. 계산의 편의를 위해 단광원으로 가정함. 

어느 한 교점에 도달한 빛은 _Ambient_ + \\( \sum \\) (_Specular_ + _Diffuse_) 로 계산할 수 있다. 여러 광원이 존재할 경우 모든 광원에 대해 Specular 와 Diffuse를 고려하여 합한 후 Ambient를 고려해야 하지만, 단광원임을 가정하였기 때문에 _Ambient_ + (_Specular_ + _Diffuse_)로 계산할 것이다. 코드로 옮기면 다음과 같다.

```C
t__color	phong_lighting(t_info *info, t_ray ray, t_hit_record *rec)
{
	t_vec	light;

	light = get_point_light(info, ray, rec); // Specular + Diffuse
	light = vec_sum(light, info->light.ambient); // Ambient
	light = new_vector(light.x * rec->albedo.x, light.y * rec->albedo.y, \
						light.z * rec->albedo.z); // consider object's albedo (color)
	light = vec_truncate(light, 1.0); // truncate the light vector (max = 1)
	return (vec_to_color(light));
}
```

### Ambient Lighting

```C
info->light.ambient = color_to_vec(info->light.al_color);
info->light.ambient = vec_mul(info->light.ambient, info->light.al_ratio);
```

- _Ambient_ 는 기본적으로 색과 강도를 직접 지정해야 한다. 
- 색을 벡터로 바꾸어 강도를 스칼라 곱 하면 _Ambient_ 값을 구할 수 있다.


### Diffuse lighting

- _Diffuse_ 는 ray-object 의 교점에서 광원으로 향하는 벡터와, 교점에서의 법선 벡터의 내적으로 구할 수 있다. (정확히는 사이의 각도를 계산하는 것이다.)
- 면적이 가장 작을 경우는 두 벡터의 방향이 같은 경우일 것이다. (사이각이 0 = 벡터 내적이 최대)
- 사이각이 90도 이상이 되면, 아래 그림의 C처럼 되어 물체에 빛이 도달하지 않는다. (벡터 내적이 최소)

![diffuse](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/b3acd2e6-0387-4556-9b7a-0b4e1d31762b)

- 사이의 각도를 표현하는 \\( \cos \theta \\) 값을 통해 (내적 결과) `diffuse_strength`를 계산하고, 이를 빛의 색(백색광만 고려하였다.)에다 가중치로 곱한다.

```C
t_vec	get_point_light(t_info *info, t_ray ray, t_hit_record *rec)
{
	t_vec	result;
	t_vec	light_dir;
	t_ray	light_ray;
	double	diffuse_strength;
	double	brightness;

	light_dir = vec_sub(info->light.light_coor, rec->p);
	light_ray = new_ray(vec_sum(rec->p, vec_mul(rec->normal, 0.000001)), \
		light_dir);
	light_dir = vec_normalize(light_dir);
	diffuse_strength = fmax(vec_dot(rec->normal, light_dir), 0.0);
	result = vec_mul(new_vector(1, 1, 1), diffuse_strength);
	return (result);
}
```

### Specular Lighting

- _Specular_는 교점에서 카메라를 향하는 벡터(`view_dir`)와, 위 코드의 `light_dir`을 법선을 기준으로 대칭시킨 벡터(`reflect_dir`)의 사이각에 따른 코사인값, 물체의 반짝거리는 정도를 나타내는 값(SPECULAR_BRIGHTNESS), [0,1] 사이의 임의 값으로 설정되는 specular 강도(SPECULAR_STRENGTH)의 연산을 통해 결정된다.

\\[ \text{Specular} = \text{SPECULAR\_STRENGTH} * (\text{view\_dir} \cdot \text{reflect\_dir})^{\text{SPECULAR\_BRIGHTNESS}} \\]

`reflect_dir`은 다음과 같이 구할 수 있다.

![reflect](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/29fb6d5f-0d79-413d-807a-66f5211b4b20)

최종적인 `get_point_light` 함수는 다음과 같다.

```C
t_vec	get_specular_light(t_ray ray, t_vec light_dir, t_hit_record *rec)
{
	t_vec	view_dir;
	t_vec	reflect_dir;
	double	spec;

	view_dir = vec_normalize(vec_mul(ray.dir, -1));
	reflect_dir = vec_mul(light_dir, -1);
	reflect_dir = vec_mul(rec->normal, vec_dot(rec->normal, reflect_dir) * 2);
	reflect_dir = vec_sub(vec_mul(light_dir, -1), reflect_dir);
	spec = pow(fmax(vec_dot(view_dir, reflect_dir), 0.0), SPECULAR_BRIGHTNESS);
	return (vec_mul(vec_mul(new_vector(1, 1, 1), SPECULAR_STRENGTH), spec));
}

t_vec	get_point_light(t_info *info, t_ray ray, t_hit_record *rec)
{
	t_vec	result;
	t_vec	light_dir;
	t_ray	light_ray;
	double	diffuse_strength;
	double	brightness;

	light_dir = vec_sub(info->light.light_coor, rec->p);
	light_ray = new_ray(vec_sum(rec->p, vec_mul(rec->normal, 0.000001)), \
		light_dir);
	light_dir = vec_normalize(light_dir);
	diffuse_strength = fmax(vec_dot(rec->normal, light_dir), 0.0);
	result = vec_mul(new_vector(1, 1, 1), diffuse_strength);
	// **Add Specular**
	result = vec_sum(result, get_specular_light(ray, light_dir, rec));
	// Considering light brightness
	brightness = info->light.brightness * LUMEN; // LUMEN : 광원이 내보내는 빛의 양
	result = vec_mul(result, brightness);
	return (result);
}
```

## Hard Shadow

## Camera Expansion

## Reference

<https://github.com/GaepoMorningEagles/mini_raytracing_in_c/>
<https://learnopengl.com/Lighting/Basic-Lighting>
<https://raytracing.github.io/>