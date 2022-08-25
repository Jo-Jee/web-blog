---
id: kubernetes-structure
title: Kubernetes 구조
date: 2022-08-25
summary: Kubernetes의 구조와 구성 요소들을 통해 pod이 배포, 관리되는 플로우를 알아본다.
topic: kubernetes
published: true
tags:
  - kubernetes
  - k8s
---
## 컨트롤 플레인과 노드
k8s는 흔히 마스터라고 부르는 컨트롤 플레인 컴포넌트와 노드로 구성된다. 컨트롤 플레인은 클러스터 전반의 상태를 감지하고 관리한다. 반대로 노드 컴포넌트는 실제로 파드를 실행하고 유지한다. 간단하게 역할은 그렇고 이제 컨트롤 플레인과 노드의 내부 구조와 작동 방식에 대해 알아보자.

## 컨트롤 플레인 컴포넌트
컨트롤 플레인 컴포너트는 클러스터 내의 어떤 머신에서나 동작할 수 있다. 하지만 권장하는 방식은 아니며 보통 간결성을 위해서 동일 머신 내에서 모든 컨트롤 플레인 컴포넌트를 구동하고 실제 서비스 로직이 들어간 컨테이너의 경우에는 이 머신에서 동작하지 않는다. 그렇다면 이 컨트롤 플레인 컴포넌트의 종류와 역할에 대해 알아보자.

## kube-apiserver
API 서버는 k8s의 API를 노출하는 컴포넌트이다. 확장이 가능한 형태라서 로드밸런싱이 가능하다. 일반적인 경우 모든 컨트롤은 이 API 서버를 통해 이루어진다.

## etcd
모든 클러스터의 데이터를 담는 Key-Value 구조의 기본 데이터 저장소이다. 고가용성을 위해 백업을 하는것을 권장한다.

## kube-scheduler
노드를 배정받지 못 한 파드가 있다면 이를 감지하고 실행할 노드를 선택하는 컴포넌트이다. 리소스, 어피니티등 k8s에서 고려해야하는 사항들을 고려해 스케줄링한다. 스케줄링만 하고 실제 실행을 시키진 않는다.

## kube-controller-manager
컨트롤러 프로세스를 실행하는 컴포넌트이다. 아래 4가지의 프로세스로 구성된다.

  - 노드 컨트롤러: 노드가 다운되었을 때 통지와 대응을 하고 노드 등록 시점에 CIDR 블럭을 할당하는 등 노드를 관리하는 역할을 한다.
  - 레플리케이션 컨트롤러: 클러스터의 모든 레플리케이션 컨트롤러 오브젝트에 대해 알맞은 파드 수를 유지시켜 주는 역할을 한다.
  - 앤드포인트 컨트롤러: 서비스와 파드를 연결시켜주는 역할을 한다.
  - 서비스 어카운트, 토큰 컨트롤러: 새로운 네임스페이스에 대한 기본 계정과 API 접근 토큰을 생성한다.

즉 위의 스케줄러가 스케줄링을 하면 레플리케이션 컨트롤러가 실제 파드를 실행시킨다.

이 컨트롤러 프로세스들은 분리된 프로세스이지만, 간결성을 위해 모두 단일 바이너리로 컴파일하고 단일 프로세스로 실행한다.

## cloud-controller-manager
AWS 등 클라우드별 컨트롤 로직을 포함하는 컴포넌트이다. 클러스터를 클라우드 공급자의 API에 연결한다. 즉, 클라우드에서 실행하는 클러스터의 경우에만 그 클라우드에 맞는 cloud-controller-manager를 실행하고 아닌 경우는 사용하지 않는 컴포넌트이다.

노드 컴포넌트
노드 컴포넌트는 실제 동작중인 파드를 유지하고 컨테이너를 실행하는 역할을 한다.

## kubelet
각 노드에서 실행하는 에이전트다. 파드내의 컨테이너를 실제로 관리한다. 제공된 스펙에 따라서 건강하게 동작하는지 체크한다. 만약 파드외의 즉 쿠버네티스가 실행하지 않은 컨테이너가 있다면 관리하지 않는다는 뜻이다. 

## kube-proxy
각 노드에서 실행되는 네트워크 프록시로, 서비스 개념의 구현부이다. 노드의 네트워크 규칙을 유지 관리한다. 또, 내부 네트워크 세션이나 크러스터 바깥에서 파드로 통하는 네트워크 통신을 할 수 있도록 해준다. OS에 패킷 필터링이 가능한 계층이 있을 경우에는 이를 사용하고 그렇지 않을 경우에는 트래픽 자체를 포워드 한다.

## 컨테이너 런타임
사실 k8s를 도커 컨테이너 오케스트레이터로 생각하는 경우가 있는데 사실 k8s는 도커 외에도 많은 컨테이너 런타임을 지원한다. containerd, CRI-O 등을 지원한다.

## 마치며
여기까지가 k8s의 가장 기본 컴포넌트이다. 실제 운영이나 동작을 위해서는 더 필요한 것들이 있는데 이는 다른 포스트에서 정리하도록 하겠다.