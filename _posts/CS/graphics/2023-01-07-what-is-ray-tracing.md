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
```c
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

```c
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

\\[ \|\| \vec{CP} \|\| = \|\|P-C\|\| = r^2 \\]

- 좀 더 확장하여 \\( P \\) 를 레이의 도착지점으로 보면, \\( P(t) = A + tB \\) 로 치환할 수 있다.
    
\\[ \|A + tB - C\| \cdot \|A + tB - C\| = r^2 \\]
    
\\[ A\cdot A + tA\cdot B - A \cdot C + tA\cdot B + t^2 B \cdot B - tB\cdot C - A\cdot C -tB\cdot C + C \cdot C = r^2 \\]

- \\( t \\) 에 대한 이차식으로 정리하면 다음과 같은 이차방정식을 얻을 수 있다.

\\[ B \cdot B t^2 - 2 * t B\cdot (A-C) + (A-C)\cdot (A-C) - r^2 = 0 \\]

- 판별식을 사용하여 2개의 실근을 가질 때를 조사하면, 레이와 구가 충돌하는 지점을 구할 수 있다.

\\[ D_{iscriminant} = 4 * \|\|B \cdot (A - C)\|\| - 4 * B \cdot B * (A-C)\cdot (A-C) > 0 \\]

위 과정을 C 코드로 옮기면 아래와 같은 함수로 구현할 수 있다.

```c
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

```c
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

```c
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

```c
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

```c
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

아래와 같이 _Ambient Lighting_, _Diffuse Lighing_, _Specular Lighting_ 을 모두 합산한 것이 **Phong Lighting Model** 이다.

![phong](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/031d7184-cb60-4092-b5de-7188097f9d2f)

- **Ambient Lighting** : 주변 조명, 밝은 낮 어두운 그늘에 들어가도 물체가 보이는 것처럼, 공기 중 산란되어 존재하는 빛으로 인해 물체가 밝아지는 것을 묘사
- **Diffuse Lighting** : 난반사 역할, 광선이 물체에 비스듬하게 들어올 수록 단위 면적 당 들어오는 광선 수가 적다는 논리를 적용함
- **Specular Lighting** : 정반사 역할, 물체의 반짝이는 하이라이팅을 표현
- 실제 퐁 조명 모델은 방사광(Emission)도 존재하지만 생략함. 계산의 편의를 위해 단광원으로 가정함. 

어느 한 교점에 도달한 빛은 _Ambient_ + \\( \sum \\) (_Specular_ + _Diffuse_) 로 계산할 수 있다. 여러 광원이 존재할 경우 모든 광원에 대해 Specular 와 Diffuse를 고려하여 합한 후 Ambient를 고려해야 하지만, 단광원임을 가정하였기 때문에 _Ambient_ + (_Specular_ + _Diffuse_)로 계산할 것이다. 코드로 옮기면 다음과 같다.

```c
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

현실세계의 모든 물리 법칙을 반영하지는 않기 때문에, 물리 기반 렌더링(PBR)과 같은 더 복잡한 모델에 비해 사실적이지 않은 결과를 만들 수 있다. 하지만 PBR과 비교해서 그렇다는거지 퐁 조명 모델 자체도 훌륭한 결과를 낼 수 있다. 또한, 퐁 조명 모델 조차 계산 집약적이라서 실시간으로 수많은 광원을 처리하기에는 무리가 있다.

### Ambient Lighting

```c
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

```c
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

- _Specular_ 는 교점에서 카메라를 향하는 벡터(`view_dir`)와, 위 코드의 `light_dir`을 법선을 기준으로 대칭시킨 벡터(`reflect_dir`)의 사이각에 따른 코사인값, 물체의 반짝거리는 정도를 나타내는 값(SPECULAR_BRIGHTNESS), [0,1] 사이의 임의 값으로 설정되는 _Specular_ 강도(SPECULAR_STRENGTH)의 연산을 통해 결정된다.

\\[ \text{Specular} = \text{SPECULAR\_STRENGTH} * (\text{view\_dir} \cdot \text{reflect\_dir})^{\text{SPECULAR\_BRIGHTNESS}} \\]

`reflect_dir`은 다음과 같이 구할 수 있다.

![reflect](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/29fb6d5f-0d79-413d-807a-66f5211b4b20)

최종적인 `get_point_light` 함수는 다음과 같다.

```c
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

![hard and soft](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/1b106d99-535a-4abc-bc01-928eb308706e)

- 위 그림의 왼쪽이 `Hard Shadow`, 오른쪽이 `Soft Shadow`이다. 
- 현실세계의 그림자는 Soft Shadow이다. 위 그림을 잘 보면 그림자의 경계가 뭉개지는 것을 볼 수 있다.
- 보다 덜 사실적이지만, 적은 연산량으로 현실세계와 비슷한 그림자를 구현할 수 있는 Hard Shadow를 구현할 것이다.

![hard shadow](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/c442d974-8e91-41fd-a42a-bef4dddd794f)

- 위 그림과 같이, object와 광원 사이 또 다른 object가 존재한다면, 그림자가 생긴다고 볼 수 있다.
- object의 교점으로 부터 광원방향의 ray를 쐈을 때 충돌하는 물체가 있다면, 그림자가 생긴다고 판단할 것이다.

```c
int	in_shadow(t_info *info, t_ray light_ray, double light_len)
{
	t_hit_record	rec;

	rec.tmin = 0;
	rec.tmax = light_len;
	if (check_ray_hit(light_ray, info, &rec) != -1)
		return (1);
	return (0);
}
```

위 함수를 `get_point_light()`에 적용하여, 충돌을 감지하는 경우에 대해 검은색을 반환하도록 처리해준다.

## Camera Expansion

빛과 여러 물체, 주변광과 정반사 및 난반사, 그림자 등 많은 요소를 고려할 수 있게 되었다. 마지막으로 원점에 고정하였던 카메라를 이동 시킬 수 있도록 수정하고, 시야각을 고려해보자.

### Camera Orientation

![orientation](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/b9a0fd90-db31-4117-9da6-6a3bb65dddd2)

- 이제 카메라의 시점과 방향을 고려해보자. 위 그림에서 `lookfrom`을 카메라의 시점, `lookfrom→lookat` 벡터를 카메라의 방향벡터로 볼 것이다.
- 따라서 카메라의 방향벡터는 `lookat - lookfrom` 으로 볼 수 있을 것이다. 이것을 \\( -w \\) 라고 하자.
- 카메라의 시점을 중심, \\( w \\) 를 법선벡터로 갖는 한 평면을 생각해보자. 이 평면에서, 정규직교기저 \\( v, u \\) 를 정의할 수 있을 것이다.
- 또한, 3차원 공간에 대한 직교기저를 표현하기 위해서 \\( \text{v}_\text{up} \\) 이라는 벡터도 정의할 것이다.
- 어떠한 벡터든, \\( (v, w) \\)를 정규직교기저로 하는 평면에 투영시키면 \\(  \text{v}_\text{up} \\) 을 얻을 수 있다. 
- 우리는 계산을 편리하게 하기 위해서, 절대적 상단이라고 취급할 수 있는 (0,1,0)을 \\( \text{v}_\text{up} \\) 으로 사용할 것이다.
- \\( (\text{v}_\text{up}, u, w) \\) 가 한 평면에 존재한다는 사실을 잊어서는 안된다.
- 실제 연산 과정에서는, \\( \text{v}_\text{up} \\) 과 \\( w \\) 가 정의된 상태에서, 정규직교기저 \\( u,v \\)를 역산할 것이다.
    
\\[ u = \text{v}_\text{up} \otimes w \\]

→ 외적의 기하학적 성질로 인하여, \\( ( \text{v}_\text{up}, w) \\) 두 벡터에 수직이며, 오른손 법칙으로 휘감는 방향의 벡터를 구할 수 있다.
    
\\[ v = w \otimes u \\] 
→ 외적의 기하학적 성질로 인하여, \\( (w, u) \\) 두 벡터에 수직이며, 오른손 법칙으로 휘감는 방향의 벡터를 구할 수 있다. 벡터 외적은 순서에 민감한 연산이다. 오른손 법칙으로 인해 방향이 완전 달라지기 때문이다.
    
- 구한 정규직교기저 \\( (u,v) \\) 를 Viewport의 방향벡터로 적용시켜준다.
- 코드로 구현하면 아래와 같다.

```c
void	set_viewport_plane(t_camera *cam)
{
	t_vec	vup;
	t_vec	temp;
	t_vec	orient;

	vup = new_vector(0, 1, 0);
	orient = vec_mul(cam->orient, -1);
	temp = vec_prod(vup, orient);
	cam->vp.horizontal = vec_normalize(vec_mul(temp, cam->vp.width));
	temp = vec_prod(orient, temp);
	cam->vp.vertical = vec_normalize(vec_mul(temp, cam->vp.height));
	cam->vp.left_bot = vec_sub(cam->viewpoint, \
								vec_mul(cam->vp.horizontal, 0.5));
	cam->vp.left_bot = vec_sub(cam->vp.left_bot, \
								vec_mul(cam->vp.vertical, 0.5));
	cam->vp.left_bot = vec_sub(cam->vp.left_bot, orient);
}
```

### Camera Viewing Geometry (FOV)

![fov](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/fd68a268-ecdd-4ad8-bcf4-a124e1051a82)

- Horizontal Field Of View(HFOV)만 주어지는 경우가 있을 수 있다.
- HFOV가 정해지면 VFOV(Vertical Field Of View) 또한 결정되므로, 카메라에 적용하기 쉽게 VFOV로 변환하여 저장하고 계산할 것이다.
- 디스플레이 크기를 고정으로 생각하면, 종횡비(aspect_ratio)를 구할 수 있다. 종횡비를 \\( h \\) 라고 하면,
    
    \\[ h = \text{screen\_width} / \text{screen\_height} \\]
    
- 주어지는 HFOV 값은 각도이므로, 라디안으로 변환하면,
    
    \\[ HFOV_{rad} = HFOV_{deg} \times \pi / 180 \\]
    
- hFOV값을 vFOV 값으로 변환하고, 다시 각도로 변환시켜주자.

    \\[ VFOV_{rad} = 2 \times \arctan (\tan(\displaystyle\frac{HFOV}{2} \times h)) \\]
    
    \\[ VFOV_{deg} = VFOV_{rad} \times 180 / \pi \\]

- 계산한 VFOV값으로, Viewport의 길이를 변환시켜 시야각(FOV)을 적용할 것이다.
- \\( h \\) 를 종횡비가 아닌, 시야각에 대한 높이비 로 다시 정의하면,
    
    \\[ h = \tan (\displaystyle\frac{\theta}{2}) \\]
    
- 기존 2로 잡아놨던 Viewport의 높이에 \\( h \\) 를 곱해줄 것이다. ( \\( \theta \\) 는 라디안)

코드로 구현하면 아래와 같다.

```c
info->camera.vp.height = 2.0 * tan((info->camera.vfov * PI / 180) / 2.0);
info->camera.vp.width = info->camera.vp.height * info->aspect_ratio;
```

## Ray - Plane & Cylinder Intersection

간단한 레이트레이싱을 위한 요소로 빛, 카메라, 주변광, 난반사, 정반사, 물체 충돌 등 여러가지 요소를 고려해보았다. 위 요소를 모두 적용하면 아래와 같은 이미지를 렌더할 수 있게 된다!

![mimiRT](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/6f50c622-52d4-435e-8bab-a534e0a1495d)

이제 평면과 원기둥을 고려해볼 것이다. [Ray-Sphere Intersection](#ray-sphere-intersection)과 같은 원리로, Ray의 \\( t \\)를 구하여 도형과 레이의 교점을 구할 것이다.
- \\( P(t) = O + D*t \\) 에서 도형의 중심점을 \\( C \\)라고 하면, 
\\( P - C = D*t + X \\)로 정리할 수 있으며, \\( X = O-C \\)를 구하는 과정이 된다.

### Ray - Plane

![ray-plane](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/bd4b766d-61c9-4efd-a6ca-f54f74f755de)

- 평면의 중심점인 \\( C \\) 와, 법선벡터 \\( V \\) 를 통해 하나의 평면을 결정할 수 있다.
- Ray가 평면과 충돌하는 교점을 \\( P \\) 라고 하면, \\( \vec{CP} \\)는 \\( V \\)와 수직일 것이다. 따라서 다음이 성립한다.
    
\\[ (P-C) \cdot V = 0 \\]

위 식을 전개하면,

\\[ (D*t + X) \cdot V = 0 \\]

\\[ (D \cdot V*t) = -X \cdot V \\] 

위 식에서 \\(D \cdot V = 0 \\)인지 체크해야 한다.

\\[ t = -X \cdot V /  D \cdot V \\]
    
- \\( D \cdot V \\) 와 \\( X\cdot V \\)의 부호 또한 다른지 체크해야 한다. 그렇지 않으면, \\( t \\) 가 음수가 된다.
- \\( D \cdot V = 0 \\)인 경우와 \\( t<0 \\)인 경우는 충돌하지 않는 경우이다.
- 교점에서의 법선벡터는 평면의 법선벡터와 같으며, \\( D \cdot V < 0 \\) 인 경우는 평면의 법선벡터의 반대방향이다.

코드로 구현하면 다음과 같다.

```c
int	check_plane_hit(t_ray ray, t_plane *pl, t_hit_record *rec)
{
	t_vec	ray2center;
	double	t;

	ray2center = vec_sub(ray.orig, pl->center);
	if (vec_dot(ray.dir, pl->normal) == 0)
		return (-1);
	t = vec_dot(vec_mul(ray2center, -1), pl->normal);
	if (vec_dot(ray.dir, pl->normal) == 0)
		return (-1);
	t /= vec_dot(ray.dir, pl->normal);
	if (t <= 0)
		return (-1);
	rec->dist = t;
	rec->p = ray_at(ray, t);
	rec->normal = pl->normal;
	if (vec_dot(ray.dir, pl->normal) < 0)
		rec->normal = vec_mul(rec->normal, -1);
	rec->albedo = color_to_vec(pl->color);
	set_face_normal(ray, rec);
	return (1);
}
```

### Ray - Cylinder

진짜 찐찐막으로, 제일 복잡한 원기둥 충돌 처리를 해보자.

![ray-cylinder](https://github.com/Tolerblanc/Tolerblanc.github.io/assets/52883827/d83a9acf-cf6b-40e6-97f1-1c8cd08b2e8b)

- 원통의 경우가 제일 복잡하다. 두 밑면과 옆면을 따로 생각할 것이다. 옆면 부터 보자.
- 마찬가지로, 레이와 원기둥의 교점을 \\( P \\) 로 볼 것이다.
추가로, \\( P \\)로 부터 원기둥의 중심축으로 내린 수선의 발을 \\( A \\), 
원기둥의 중심점으로 부터 중심축의 방향벡터의 반대 방향으로 나아간 원기둥의 밑면의 중심을 \\( C \\),
\\( C \\) 로부터 원기둥 중심축의 방향벡터 방향으로 나아간 원기둥의 밑면의 중심을 \\( L \\) 이라 하자.
- \\( C \\) 로 부터 \\( A \\) 를 다시 정의할 수 있다. \\( m \\) 은 \\( V \\) 에 대한 가중치이다.

\\[ A = C + V*m \\]

이때, \\( L = C + V*\max{m} \\) 이므로, \\( \max{m} = h \\)인 것을 알 수 있다. ( \\( h \\)는 원기둥 높이 ) 따라서 \\( m \in [0, h] \\) 이다.

- 위 정의들을 통해 두 가지 성질을 도출해낼 수 있다.
    1. \\( (P-A) \cdot V = 0 \\)
    2. \\( \text{len}(P-A) = r \\)

- 1번 성질을 먼저 풀어보자.

\\[ (P - A) \cdot V = 0 \\]

\\[ (P - C - V*m) \cdot V = 0 \\]

\\[ (P-C) \cdot V = m*(V\cdot V) = m \\]

( \\( V \\)는 방향벡터이므로, 길이 및 자기자신의 내적값이 1이다.)

\\[ m = (D*t + X) \cdot V \\]

\\[ m = D\cdot V*t + X\cdot V \\]
    
추가로, \\( (P-A) \\) 를 정규화 하면 법선벡터를 구할 수 있다.
    
- 2번 성질도 풀어보자.

\\[ \text{len}(P-A) = r \\]

\\[ \text{len}(P-C-V*m) = r \\]

\\[ \text{dot} \\{Dt+X - V(D\cdot V*t + X\cdot V) \\} = r^2 \\]

( \\( \text{dot} \\) = 자기 자신의 내적)

\\[ \text{dot} \\{ (D-V*(D\cdot V)) \*t + (X-V \* (X \cdot V)) \\} = r^2 \\]


\\[ \text{dot}(A-V*(A \cdot V)) = A \cdot A - (A \cdot V)^2 \\]

를 이용하여 위 식을 쭉 전개하고, 그 결과를 \\( a\*t^2 + b\*t + c = 0 \\) 라고 하였을 때,

\\[ a = D \cdot D - (D \cdot V)^2 \\]

\\[ c = X\cdot X - (X\cdot V)^2 - r^2 \\]

\\[ b = 2 \* (D-V \* (D \cdot V)) \cdot (X-V \* (X \cdot V)) \\]

\\[ b = 2 * (D\cdot X - (D \cdot V) *( X \cdot V)) \\]

\\[ \displaystyle \frac{b}{2} = D \cdot X - (D\cdot V) * (X \cdot V) \\]

\\[ D_{iscreminant} = \displaystyle(\frac{b}{2})^2 - a*c > 0 \\]

- 구와 같이 판별식이 양수인 경우, 레이와 물체가 충돌한다고 간주하고, 근의 공식을 통해 \\( t \\) 를 구하여 그 중 작은 근을 충돌 위치로 판별했었다.
- 원기둥 또한 같은 원리로 작은 근을 구하면 옆면 중 눈에 보이는 부분을 구할 수 있다.
- 다만, \\( m \in [0, h] \\) 인지 검사를 한 번 해줘야한다. 그렇지 않으면 높이가 무한한 원기둥을 볼 수 있다.
- \\( m \notin [0, h] \\) 중에서, 특정한 \\( m \\) 원기둥의 밑면을 가리키게 된다. 범위를 벗어나는 \\( m \\) 중 원기둥의 밑면을 찾아보자.
- 원기둥의 밑면은 중심이 \\( C \\) 또는 \\( L \\) 이고, 법선벡터가 \\( -V \\) 또는 \\( V \\) 일 것이다.

위 내용을 코드로 구현하면 아래와 같다.
```c
double	cylinder_discriminant(t_ray ray, t_vec ray2cap, \
								t_cylinder *cy, double *half_b)
{
	double	a;
	double	c;

	*half_b = vec_dot(ray.dir, ray2cap) - (vec_dot(ray.dir, cy->axis) * \
		vec_dot(ray2cap, cy->axis));
	a = vec_dot(ray.dir, ray.dir) - pow(vec_dot(ray.dir, cy->axis), 2);
	c = vec_dot(ray2cap, ray2cap) - \
		pow(vec_dot(ray2cap, cy->axis), 2) - cy->rsquare;
	return (*half_b * *half_b - a * c);
}

int	check_cylinder_hit(t_ray ray, t_cylinder *cy, t_hit_record *rec)
{
	double	half_b;
	double	discriminant;
	double	other_root;
	double	a;

	discriminant = cylinder_discriminant(ray, \
		vec_sub(ray.orig, cy->cap_point), cy, &half_b);
	a = vec_dot(ray.dir, ray.dir) - pow(vec_dot(ray.dir, cy->axis), 2);
	if (discriminant <= 0)
		return (-1);
	rec->dist = (-half_b - sqrt(discriminant)) / a;
	other_root = (-half_b + sqrt(discriminant)) / a;
	rec->p = ray_at(ray, rec->dist);
	if (!(cylinder_normal(ray, cy, rec, other_root)))
		return (-1);
	rec->albedo = color_to_vec(cy->color);
	set_face_normal(ray, rec);
	return (1);
}

int	cylinder_normal(t_ray ray, t_cylinder *cy, t_hit_record *rec, double root)
{
	double	m;

	rec->normal = vec_sub(rec->p, cy->cap_point);
	m = vec_dot(ray.dir, vec_mul(cy->axis, rec->dist)) + \
		vec_dot(vec_sub(ray.orig, cy->center), cy->axis);
	if (m < 0 || m > cy->height || \
		rec->dist < rec->tmin || rec->dist > rec->tmax)
	{
		rec->dist = root;
		rec->p = ray_at(ray, rec->dist);
		rec->normal = vec_sub(rec->p, cy->cap_point);
		m = vec_dot(ray.dir, vec_mul(cy->axis, rec->dist)) + \
		vec_dot(vec_sub(ray.orig, cy->center), cy->axis);
		if (m < 0 || m > cy->height || \
			rec->dist < rec->tmin || rec->dist > rec->tmax)
			return (0);
	}  
	rec->normal = vec_sub(rec->normal, vec_mul(cy->axis, m));
	rec->normal = vec_normalize(rec->normal);
	return (1);
}
```

## Reference

<https://github.com/GaepoMorningEagles/mini_raytracing_in_c/>

<https://learnopengl.com/Lighting/Basic-Lighting>

<https://raytracing.github.io/>